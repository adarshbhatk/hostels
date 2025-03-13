import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function CookiePolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
          <h1 className="text-4xl font-bold">Cookie Policy</h1>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Last Updated: {new Date().toLocaleDateString()}</h2>
            
            <p className="text-muted-foreground">
              This Cookie Policy explains how Hostelwise uses cookies and similar technologies to recognize you when you visit our website.
            </p>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold">What are cookies?</h3>
              <p className="text-muted-foreground">
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide useful information to website owners.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold">How we use cookies</h3>
              <p className="text-muted-foreground">
                We use cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>To enable certain functions of the website</li>
                <li>To provide analytics and understand how you use our website</li>
                <li>To store your preferences</li>
                <li>To enable us to recognize and count the number of visitors</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold">Types of cookies we use</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Essential Cookies</h4>
                  <p className="text-muted-foreground">
                    These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Performance Cookies</h4>
                  <p className="text-muted-foreground">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Functionality Cookies</h4>
                  <p className="text-muted-foreground">
                    These cookies enable the website to provide enhanced functionality and personalization based on your preferences.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold">How to control cookies</h3>
              <p className="text-muted-foreground">
                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
              </p>
              <p className="text-muted-foreground">
                Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser. Please refer to your browser's help documentation for more information.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold">Contact Us</h3>
              <p className="text-muted-foreground">
                If you have any questions about our Cookie Policy, please contact us:
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