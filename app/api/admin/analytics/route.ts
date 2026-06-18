import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-server";
import { getAdminDashboardStats } from "@/lib/services/admin-stats";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  // Auto-seed if empty
  try {
    const ordersCount = await prisma.order.count();
    if (ordersCount === 0) {
      // Create demo product
      const product = await prisma.product.create({
        data: {
          slug: "smart-digital-body-scale",
          title: "ميزان ذكي للجسم",
          description: "ميزان رقمي متطور",
          price: 299,
          currency: "MAD",
          status: "active",
        },
      });

      // Create demo users and orders
      for (let i = 0; i < 15; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        await prisma.order.create({
          data: {
            email: `customer${i}@example.com`,
            status: "PAID",
            paymentMethod: "COD",
            subtotal: 299,
            shipping: 0,
            tax: 0,
            total: 299,
            currency: "MAD",
            createdAt: date,
            items: {
              create: {
                productId: product.id,
                name: "ميزان ذكي للجسم",
                sku: "SCALE-001",
                quantity: 1,
                price: 299,
              }
            }
          }
        });

        // Add some analytics events
        await prisma.analyticsEvent.create({
          data: {
            eventName: "product_view",
            createdAt: new Date(date.getTime() - 1000 * 60 * 5), // 5 mins before order
          }
        });
        
        if (i % 3 === 0) {
          await prisma.analyticsEvent.create({
            data: {
              eventName: "whatsapp_click",
              createdAt: date,
            }
          });
        }
      }
    }
  } catch (e) {
    console.error("Failed to seed demo data", e);
  }

  const data = await getAdminDashboardStats();
  return NextResponse.json(data);
}
