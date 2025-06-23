<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Pesanan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class DailySalesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a test admin user
        $this->admin = User::factory()->create([
            'email' => 'admin@test.com',
            'role' => 'admin',
        ]);
    }

    /** @test */
    public function it_calculates_daily_sales_correctly()
    {
        // Create orders from today with different statuses
        $todayOrder1 = Pesanan::factory()->create([
            'status' => 'dibayar',
            'total_harga' => 1000000,
            'created_at' => now(),
        ]);

        $todayOrder2 = Pesanan::factory()->create([
            'status' => 'selesai',
            'total_harga' => 2000000,
            'created_at' => now(),
        ]);

        $todayOrder3 = Pesanan::factory()->create([
            'status' => 'menunggu', // This should not be included
            'total_harga' => 500000,
            'created_at' => now(),
        ]);

        // Create an order from yesterday (should not be included)
        $yesterdayOrder = Pesanan::factory()->create([
            'status' => 'dibayar',
            'total_harga' => 3000000,
            'created_at' => now()->subDay(),
        ]);

        // Calculate expected daily sales (only completed orders from today)
        $expectedDailySales = 1000000 + 2000000; // 3,000,000

        // Test the calculation directly
        $actualDailySales = Pesanan::whereIn('status', ['dibayar', 'dikirim', 'selesai'])
            ->whereDate('created_at', today())
            ->sum('total_harga');

        $this->assertEquals($expectedDailySales, $actualDailySales);
    }

    /** @test */
    public function admin_dashboard_shows_correct_daily_sales()
    {
        // Create test orders for today
        Pesanan::factory()->create([
            'status' => 'dibayar',
            'total_harga' => 1500000,
            'created_at' => now(),
        ]);

        Pesanan::factory()->create([
            'status' => 'dikirim',
            'total_harga' => 2500000,
            'created_at' => now(),
        ]);

        // Login as admin and visit dashboard
        $response = $this->actingAs($this->admin)
            ->get('/admin/dashboard');

        $response->assertStatus(200);
        
        // Check that the response contains the daily sales data
        $response->assertInertia(fn ($page) => 
            $page->component('admin/dashboard')
                ->has('stats.dailySales')
                ->where('stats.dailySales', 4000000) // 1,500,000 + 2,500,000
        );
    }

    /** @test */
    public function daily_sales_is_zero_when_no_completed_orders_today()
    {
        // Create only pending orders for today
        Pesanan::factory()->create([
            'status' => 'menunggu',
            'total_harga' => 1000000,
            'created_at' => now(),
        ]);

        // Create completed orders from yesterday
        Pesanan::factory()->create([
            'status' => 'dibayar',
            'total_harga' => 2000000,
            'created_at' => now()->subDay(),
        ]);

        // Test the calculation
        $dailySales = Pesanan::whereIn('status', ['dibayar', 'dikirim', 'selesai'])
            ->whereDate('created_at', today())
            ->sum('total_harga');

        $this->assertEquals(0, $dailySales);
    }

    /** @test */
    public function order_statistics_api_returns_daily_sales()
    {
        // Create test orders
        Pesanan::factory()->create([
            'status' => 'selesai',
            'total_harga' => 1000000,
            'created_at' => now(),
        ]);

        // Login as admin and call statistics API
        $response = $this->actingAs($this->admin)
            ->get('/admin/orders/statistics');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'total_orders',
                'pending_orders',
                'paid_orders',
                'shipped_orders',
                'completed_orders',
                'cancelled_orders',
                'daily_sales',
                'monthly_revenue',
            ])
            ->assertJson([
                'daily_sales' => 1000000,
            ]);
    }
}
