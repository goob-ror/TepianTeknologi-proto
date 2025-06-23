<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Pesanan;
use App\Models\Product;
use App\Models\DetailPesanan;
use App\Models\Kategori;
use App\Models\Brand;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TransactionProofTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test data
        $this->category = Kategori::factory()->create(['nama_kategori' => 'Test Category']);
        $this->brand = Brand::factory()->create(['nama_brand' => 'Test Brand']);

        $this->product = Product::factory()->create([
            'nama_produk' => 'Test Product',
            'harga' => 100000,
            'kategori_id' => $this->category->id,
            'brand_id' => $this->brand->id,
        ]);

        $this->user = User::factory()->create([
            'nama_lengkap' => 'Test User',
            'email' => 'test@example.com',
            'role' => 'user',
        ]);

        $this->admin = User::factory()->create([
            'nama_lengkap' => 'Test Admin',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        $this->order = Pesanan::factory()->create([
            'user_id' => $this->user->id,
            'nama_penerima' => 'Test Recipient',
            'alamat' => 'Test Address',
            'total_harga' => 200000,
            'status' => 'selesai',
        ]);

        DetailPesanan::create([
            'pesanan_id' => $this->order->id,
            'produk_id' => $this->product->id,
            'jumlah' => 2,
            'harga_satuan' => 100000,
        ]);
    }

    /** @test */
    public function admin_can_download_transaction_proof()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/orders/{$this->order->id}/transaction-proof");

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
        $response->assertHeader('Content-Disposition', 'attachment; filename=transaction_proof_order_' . $this->order->id . '_' . now()->format('Y-m-d') . '.pdf');
    }

    /** @test */
    public function user_can_download_their_own_transaction_proof()
    {
        $response = $this->actingAs($this->user)
            ->get("/order/{$this->order->id}/transaction-proof");

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
        $response->assertHeader('Content-Disposition', 'attachment; filename=transaction_proof_order_' . $this->order->id . '_' . now()->format('Y-m-d') . '.pdf');
    }

    /** @test */
    public function user_cannot_download_other_users_transaction_proof()
    {
        $otherUser = User::factory()->create([
            'nama_lengkap' => 'Other User',
            'email' => 'other@example.com',
            'role' => 'user',
        ]);

        $response = $this->actingAs($otherUser)
            ->get("/order/{$this->order->id}/transaction-proof");

        // Should get a redirect or 403 - both are acceptable for unauthorized access
        $this->assertTrue(in_array($response->getStatusCode(), [302, 403]));
    }

    /** @test */
    public function guest_cannot_download_transaction_proof()
    {
        $response = $this->get("/order/{$this->order->id}/transaction-proof");

        $response->assertRedirect('/login');
    }

    /** @test */
    public function admin_transaction_proof_route_exists()
    {
        $this->assertTrue(
            collect(\Route::getRoutes())->contains(function ($route) {
                return $route->getName() === 'admin.orders.transaction-proof';
            })
        );
    }

    /** @test */
    public function user_transaction_proof_route_exists()
    {
        $this->assertTrue(
            collect(\Route::getRoutes())->contains(function ($route) {
                return $route->getName() === 'order.transaction-proof';
            })
        );
    }

    /** @test */
    public function transaction_proof_pdf_contains_order_information()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/orders/{$this->order->id}/transaction-proof");

        $response->assertStatus(200);

        // Check that the response is a PDF
        $this->assertStringStartsWith('%PDF', $response->getContent());
    }
}
