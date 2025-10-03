import type { Metadata } from 'next';
import Container from '@/components/Container';

export const metadata: Metadata = {
  title: 'Cookie Policy | MyBeing by Meum Labs',
  description: 'Learn about how MyBeing uses cookies and similar technologies to enhance your experience on our platform.',
  robots: 'index, follow',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <Container>
        <div className="py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-semibold mb-6">
                <span>🍪</span>
                Legal Document
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Cookie Policy
              </h1>
              <p className="text-xl text-gray-600">
                Last updated: September 30, 2025
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <div className="cookie-policy-content">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    This Cookie Policy explains how <strong>Memu Labs</strong> ("<strong>Company</strong>," "<strong>we</strong>," "<strong>us</strong>," and "<strong>our</strong>") uses cookies and similar technologies to recognize you when you visit our website at{' '}
                    <a href="https://mybeing.in" className="text-purple-600 hover:text-purple-700 underline">
                      https://mybeing.in
                    </a>{' '}
                    ("<strong>Website</strong>"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-8">
                    In some cases we may use cookies to collect personal information, or that becomes personal information if we combine it with other information.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What are cookies?</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-8">
                    Cookies set by the website owner (in this case, Memu Labs) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Why do we use cookies?</h2>
                  <p className="text-gray-700 leading-relaxed mb-8">
                    We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes. This is described in more detail below.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">How can I control cookies?</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-8">
                    The Cookie Consent Manager can be found in the notification banner and on our Website. If you choose to reject cookies, you may still use our Website though your access to some functionality and areas of our Website may be restricted. You may also set or amend your web browser controls to accept or refuse cookies.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Analytics and customization cookies:</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-gray-900">Name:</strong> s7
                      </div>
                      <div>
                        <strong className="text-gray-900">Provider:</strong> mybeing.in
                      </div>
                      <div className="md:col-span-2">
                        <strong className="text-gray-900">Purpose:</strong> Gather data regarding site usage and user behavior on the website.
                      </div>
                      <div>
                        <strong className="text-gray-900">Service:</strong> Adobe Analytics
                      </div>
                      <div>
                        <strong className="text-gray-900">Expires in:</strong> session
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Authentication cookies:</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    These cookies are essential for user authentication and maintaining secure sessions on our platform.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-gray-900">Name:</strong> next-auth.callback-url
                      </div>
                      <div>
                        <strong className="text-gray-900">Provider:</strong> mybeing.in
                      </div>
                      <div className="md:col-span-2">
                        <strong className="text-gray-900">Purpose:</strong> Manages authentication flow and secure user sessions
                      </div>
                      <div>
                        <strong className="text-gray-900">Type:</strong> server_cookie
                      </div>
                      <div>
                        <strong className="text-gray-900">Expires in:</strong> session
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">How can I control cookies on my browser?</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information. The following is information about how to manage cookies on the most popular browsers:
                  </p>

                  <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
                    <li>
                      <a href="https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies" 
                         className="text-purple-600 hover:text-purple-700 underline" 
                         target="_blank" 
                         rel="noopener noreferrer">
                        Chrome
                      </a>
                    </li>
                    <li>
                      <a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" 
                         className="text-purple-600 hover:text-purple-700 underline" 
                         target="_blank" 
                         rel="noopener noreferrer">
                        Internet Explorer
                      </a>
                    </li>
                    <li>
                      <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" 
                         className="text-purple-600 hover:text-purple-700 underline" 
                         target="_blank" 
                         rel="noopener noreferrer">
                        Firefox
                      </a>
                    </li>
                    <li>
                      <a href="https://support.apple.com/en-ie/guide/safari/sfri11471/mac" 
                         className="text-purple-600 hover:text-purple-700 underline" 
                         target="_blank" 
                         rel="noopener noreferrer">
                        Safari
                      </a>
                    </li>
                    <li>
                      <a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" 
                         className="text-purple-600 hover:text-purple-700 underline" 
                         target="_blank" 
                         rel="noopener noreferrer">
                        Edge
                      </a>
                    </li>
                    <li>
                      <a href="https://help.opera.com/en/latest/web-preferences/" 
                         className="text-purple-600 hover:text-purple-700 underline" 
                         target="_blank" 
                         rel="noopener noreferrer">
                        Opera
                      </a>
                    </li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What about other tracking technologies, like web beacons?</h2>
                  <p className="text-gray-700 leading-relaxed mb-8">
                    Cookies are not the only way to recognize or track visitors to a website. We may use other, similar technologies from time to time, like web beacons (sometimes called "tracking pixels" or "clear gifs"). These are tiny graphics files that contain a unique identifier that enables us to recognize when someone has visited our Website or opened an email including them. This allows us, for example, to monitor the traffic patterns of users from one page within a website to another, to deliver or communicate with cookies, to understand whether you have come to the website from an online advertisement displayed on a third-party website, to improve site performance, and to measure the success of email marketing campaigns.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Do you serve targeted advertising?</h2>
                  <p className="text-gray-700 leading-relaxed mb-8">
                    Third parties may serve cookies on your computer or mobile device to serve advertising through our Website. These companies may use information about your visits to this and other websites in order to provide relevant advertisements about goods and services that you may be interested in. The information collected through this process does not enable us or them to identify your name, contact details, or other details that directly identify you unless you choose to provide these.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">How often will you update this Cookie Policy?</h2>
                  <p className="text-gray-700 leading-relaxed mb-8">
                    We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies. The date at the top of this Cookie Policy indicates when it was last updated.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Where can I get further information?</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions about our use of cookies or other technologies, please contact us at:
                  </p>

                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <div className="space-y-2 text-gray-700">
                      <div><strong>Memu Labs</strong></div>
                      <div>Manikonda</div>
                      <div>Hyderabad, Telangana 500104</div>
                      <div>India</div>
                      <div>Phone: (+91) 06302738518</div>
                      <div>Email: <a href="mailto:hello@mybeing.in" className="text-purple-600 hover:text-purple-700 underline">hello@mybeing.in</a></div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Manage Your Cookie Preferences</h4>
                    <p className="text-sm text-blue-800 mb-3">
                      You can update your cookie preferences at any time by clicking the link below:
                    </p>
                    <a href="#" className="termly-display-preferences inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      <span>🍪</span>
                      Update Cookie Preferences
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
