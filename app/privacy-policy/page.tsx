import type { Metadata } from 'next';
import Container from '@/components/Container';

export const metadata: Metadata = {
  title: 'Privacy Policy | MyBeing by Meum Labs',
  description: 'Learn how MyBeing protects your privacy and handles your personal information in our behavioral psychology research platform.',
  robots: 'index, follow',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <Container>
        <div className="py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-semibold mb-6">
                <span>🔒</span>
                Legal Document
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-600">
                Last updated: September 30, 2025
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <div className="privacy-policy-content">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    This Privacy Notice for <strong>Memu Labs</strong> ("<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>") describes how and why we might access, collect, store, use, and/or share ("<strong>process</strong>") your personal information when you use our services ("<strong>Services</strong>"), including when you:
                  </p>

                  <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
                    <li>Visit our website at <a href="https://mybeing.in" className="text-purple-600 hover:text-purple-700 underline">https://mybeing.in</a> or any website of ours that links to this Privacy Notice</li>
                    <li>Engage with us in other related ways, including any sales, marketing, or events</li>
                  </ul>

                  <p className="text-gray-700 leading-relaxed mb-8">
                    <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <a href="mailto:mybeingbydyr@gmail.com" className="text-purple-600 hover:text-purple-700 underline">mybeingbydyr@gmail.com</a>.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Summary of Key Points</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <em>This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by using our table of contents below to find the section you are looking for.</em>
                  </p>

                  <div className="space-y-4 mb-8">
                    <div>
                      <strong className="text-gray-900">What personal information do we process?</strong>
                      <p className="text-gray-700">When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.</p>
                    </div>

                    <div>
                      <strong className="text-gray-900">Do we process any sensitive personal information?</strong>
                      <p className="text-gray-700">Some of the information may be considered "special" or "sensitive" in certain jurisdictions, for example your racial or ethnic origins, sexual orientation, and religious beliefs. We may process sensitive personal information when necessary with your consent or as otherwise permitted by applicable law.</p>
                    </div>

                    <div>
                      <strong className="text-gray-900">Do we collect any information from third parties?</strong>
                      <p className="text-gray-700">We do not collect any information from third parties.</p>
                    </div>

                    <div>
                      <strong className="text-gray-900">How do we process your information?</strong>
                      <p className="text-gray-700">We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</p>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Information Do We Collect?</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information You Disclose to Us</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <em><strong>In Short:</strong> We collect personal information that you provide to us.</em>
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
                  </p>

                  <div className="mb-6">
                    <strong className="text-gray-900">Personal Information Provided by You.</strong>
                    <p className="text-gray-700 mb-2">The personal information that we collect may include the following:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Your answers anonymously from the quiz</li>
                      <li>Age</li>
                      <li>Profession</li>
                      <li>Country</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <strong className="text-gray-900">Sensitive Information.</strong>
                    <p className="text-gray-700">When necessary, with your consent or as otherwise permitted by applicable law, we process sensitive information for research purposes.</p>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Information Automatically Collected</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <em><strong>In Short:</strong> Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.</em>
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and other technical information.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How Do We Process Your Information?</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <em><strong>In Short:</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</em>
                  </p>

                  <div className="mb-6">
                    <strong className="text-gray-900">We process your personal information for research purposes, including:</strong>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2">
                      <li><strong>Research:</strong> We take your answers anonymously and make sure we can improve our knowledge and make our questions better and help users get more from our quizzes</li>
                      <li><strong>Country:</strong> For research purposes</li>
                      <li><strong>Age:</strong> For research purposes</li>
                      <li><strong>Relationship status:</strong> For research purposes</li>
                    </ul>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Do We Use Cookies and Other Tracking Technologies?</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <em><strong>In Short:</strong> We may use cookies and other tracking technologies to collect and store your information.</em>
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    We may use cookies and similar tracking technologies to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site functions. For more information, please see our <a href="/cookie-policy" className="text-purple-600 hover:text-purple-700 underline">Cookie Policy</a>.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Do We Offer Artificial Intelligence-Based Products?</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <em><strong>In Short:</strong> We offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies.</em>
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    As part of our Services, we offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies (collectively, "AI Products"). These tools are designed to enhance your experience and provide you with innovative solutions.
                  </p>

                  <div className="mb-6">
                    <strong className="text-gray-900">Our AI Products are designed for the following functions:</strong>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2">
                      <li>AI research</li>
                      <li>AI predictive analytics</li>
                    </ul>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. How Long Do We Keep Your Information?</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <em><strong>In Short:</strong> We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.</em>
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law. When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. How Do We Keep Your Information Safe?</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    <em><strong>In Short:</strong> We aim to protect your personal information through a system of organizational and technical security measures.</em>
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. What Are Your Privacy Rights?</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <em><strong>In Short:</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.</em>
                  </p>

                  <div className="mb-6">
                    <strong className="text-gray-900">You may have the right to:</strong>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2">
                      <li>Access your personal information</li>
                      <li>Correct inaccurate data</li>
                      <li>Request deletion of your data</li>
                      <li>Opt-out of communications</li>
                      <li>Export your data</li>
                    </ul>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Do We Make Updates to This Notice?</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    <em><strong>In Short:</strong> Yes, we will update this notice as necessary to stay compliant with relevant laws.</em>
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. How Can You Contact Us About This Notice?</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have questions or comments about this notice, you may contact us at:
                  </p>

                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <div className="space-y-2 text-gray-700">
                      <div><strong>Memu Labs</strong></div>
                      <div>Manikonda</div>
                      <div>Hyderabad, Telangana 500104</div>
                      <div>India</div>
                      <div>Phone: (+91) 06302738518</div>
                      <div>Email: <a href="mailto:mybeingbydyr@gmail.com" className="text-purple-600 hover:text-purple-700 underline">mybeingbydyr@gmail.com</a></div>
                    </div>
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
