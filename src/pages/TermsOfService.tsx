import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Last Updated: {new Date().toLocaleDateString()}</h2>
            
            <p className="text-muted-foreground">
              Welcome to Hostelwise. By accessing our website, you agree to these terms and conditions.
            </p>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold">1. Acceptance of Terms</h3>
              <p className="text-muted-foreground">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold">2. User Accounts</h3>
              <p className="text-muted-foreground">
                When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>You must be 13 years or older to use this service</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree to accept responsibility for all activities that occur under your account</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold">3. Content and Reviews</h3>
              <p className="text-muted-foreground">
                When posting reviews or content, you agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide honest and accurate information</li>
                <li>Not post harmful, offensive, or illegal content</li>
                <li>Not impersonate others or provide false information</li>
                <li>Grant us the right to display and moderate your content</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold">4. Service Modifications</h3>
              <p className="text-muted-foreground">
                We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold">5. Limitation of Liability</h3>
              <p className="text-muted-foreground">
                We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold">Contact Information</h3>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Email: adarshbhatk@gmail.com</li>
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