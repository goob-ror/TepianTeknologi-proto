<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Pesanan;
use App\Models\Pembayaran;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PaymentProofUploadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create test admin user
        $this->admin = User::factory()->create([
            'email' => 'admin@test.com',
            'role' => 'admin',
        ]);
        
        // Create test order
        $this->order = Pesanan::factory()->create([
            'status' => 'menunggu',
            'total_harga' => 1000000,
        ]);
        
        // Fake storage for testing
        Storage::fake('public');
    }

    /** @test */
    public function admin_can_upload_payment_proof()
    {
        $file = UploadedFile::fake()->image('payment_proof.jpg');

        $response = $this->actingAs($this->admin)
            ->post("/admin/orders/{$this->order->id}/upload-payment-proof", [
                'bukti_pembayaran' => $file,
                'metode' => 'WhatsApp Transfer',
                'jumlah_bayar' => 1000000,
                'catatan_validasi' => 'Payment received via WhatsApp',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Check if payment record was created
        $this->assertDatabaseHas('pembayaran', [
            'pesanan_id' => $this->order->id,
            'metode' => 'WhatsApp Transfer',
            'jumlah_bayar' => 1000000,
            'status' => 'menunggu_validasi',
        ]);

        // Check if file was stored
        $payment = Pembayaran::where('pesanan_id', $this->order->id)->first();
        $this->assertNotNull($payment->bukti_pembayaran);
        Storage::disk('public')->assertExists($payment->bukti_pembayaran);

        // Check if order status was updated
        $this->order->refresh();
        $this->assertEquals('dibayar', $this->order->status);
    }

    /** @test */
    public function admin_can_validate_payment_proof()
    {
        // Create payment record first
        $payment = Pembayaran::create([
            'pesanan_id' => $this->order->id,
            'metode' => 'WhatsApp Transfer',
            'bukti_pembayaran' => 'payments/test_proof.jpg',
            'status' => 'menunggu_validasi',
            'jumlah_bayar' => 1000000,
            'tanggal_bayar' => now(),
        ]);

        $response = $this->actingAs($this->admin)
            ->patch("/admin/orders/{$this->order->id}/validate-payment", [
                'status' => 'valid',
                'catatan_validasi' => 'Payment verified and approved',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Check if payment was validated
        $payment->refresh();
        $this->assertEquals('valid', $payment->status);
        $this->assertNotNull($payment->validated_at);
        $this->assertEquals($this->admin->id, $payment->validated_by);
        $this->assertEquals('Payment verified and approved', $payment->catatan_validasi);

        // Check if order status was updated
        $this->order->refresh();
        $this->assertEquals('dibayar', $this->order->status);
    }

    /** @test */
    public function admin_can_reject_payment_proof()
    {
        // Create payment record first
        $payment = Pembayaran::create([
            'pesanan_id' => $this->order->id,
            'metode' => 'WhatsApp Transfer',
            'bukti_pembayaran' => 'payments/test_proof.jpg',
            'status' => 'menunggu_validasi',
            'jumlah_bayar' => 1000000,
            'tanggal_bayar' => now(),
        ]);

        $response = $this->actingAs($this->admin)
            ->patch("/admin/orders/{$this->order->id}/validate-payment", [
                'status' => 'tidak_valid',
                'catatan_validasi' => 'Payment amount does not match',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Check if payment was rejected
        $payment->refresh();
        $this->assertEquals('tidak_valid', $payment->status);
        $this->assertNotNull($payment->validated_at);
        $this->assertEquals($this->admin->id, $payment->validated_by);

        // Check if order status was reverted
        $this->order->refresh();
        $this->assertEquals('menunggu', $this->order->status);
    }

    /** @test */
    public function upload_requires_valid_image_file()
    {
        $file = UploadedFile::fake()->create('document.pdf', 1000, 'application/pdf');

        $response = $this->actingAs($this->admin)
            ->post("/admin/orders/{$this->order->id}/upload-payment-proof", [
                'bukti_pembayaran' => $file,
                'metode' => 'WhatsApp Transfer',
                'jumlah_bayar' => 1000000,
            ]);

        $response->assertSessionHasErrors(['bukti_pembayaran']);
    }

    /** @test */
    public function upload_requires_all_required_fields()
    {
        $response = $this->actingAs($this->admin)
            ->post("/admin/orders/{$this->order->id}/upload-payment-proof", []);

        $response->assertSessionHasErrors(['bukti_pembayaran', 'metode', 'jumlah_bayar']);
    }

    /** @test */
    public function payment_proof_appears_in_transaction_pdf()
    {
        // Create payment with proof
        $payment = Pembayaran::create([
            'pesanan_id' => $this->order->id,
            'metode' => 'WhatsApp Transfer',
            'bukti_pembayaran' => 'payments/test_proof.jpg',
            'status' => 'valid',
            'jumlah_bayar' => 1000000,
            'tanggal_bayar' => now(),
            'validated_at' => now(),
            'validated_by' => $this->admin->id,
        ]);

        // Create a fake image file in storage
        Storage::disk('public')->put('payments/test_proof.jpg', 'fake image content');

        $response = $this->actingAs($this->admin)
            ->get("/admin/orders/{$this->order->id}/transaction-proof");

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
    }
}
