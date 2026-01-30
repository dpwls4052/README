import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Toaster } from "@/components/ui/sonner";
import { WishlistCountProvider } from "@/hooks/common/useWishlistCount";
import { CartCountProvider } from "@/hooks/common/useCartCount";

export default function MainLayout({ children }) {
  return (
    <>
      <CartCountProvider>
        <WishlistCountProvider>
          <Header />
          <main>{children}</main>
          <Toaster />
          <Footer />
        </WishlistCountProvider>
      </CartCountProvider>
    </>
  );
}
