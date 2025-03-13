import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Last Updated: {new Date().toLocaleDateString()}</h2>
            
            <p className="text-muted-foreground">
              Welcome to Hostelwise. We are committed to protecting your personal information and your right to privacy.
            </p>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold">Information We Collect</h3>
              <p className="text-muted-foreground">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Create an account or profile</li>
                <li>Write or upvote a review</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold">How We Use Your Information</h3>
              <p className="text-muted-foreground">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Process your reviews and activities</li>
                <li>Send you necessary communications (with your consent)</li>
                <li>Improve our services and user experience</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold">Data Security</h3>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security measures to protect your personal data against accidental or unlawful destruction, loss, alteration, and unauthorized disclosure or access.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold">Contact Us</h3>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Email: adarshbhatk@gmail.com.com</li>
                <li>Address: Hostelwise, Bengaluru</li>
              </ul>
            </section>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}