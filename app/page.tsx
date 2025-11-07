"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BadgePreview } from "@/components/badge-preview"
import { CodeBlock } from "@/components/code-block"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight, Shield, Heart, Code, Sparkles, CheckCircle2 } from "lucide-react"

export default function LandingPage() {
  const [selectedBadgeTheme, setSelectedBadgeTheme] = useState<"light" | "dark" | "pastel">("pastel")
  const [testimonialIndex, setTestimonialIndex] = useState(0)

  const codeSnippets = {
    html: `<script async src="https://cdn.impactengine.org/badge.js"></script>
<impact-badge charity-id="CH-0001" theme="pastel" size="medium"></impact-badge>`,
    react: `import { ImpactBadge } from "@impactengine/badge";
export default () => <ImpactBadge charityId="CH-0001" theme="light" size="small" />;`,
    markdown: `[![Impact Rating: Green](https://img.impactengine.org/badge/CH-0001?theme=pastel)](https://impactengine.org/charity/CH-0001)`,
  }

  const testimonials = [
    {
      quote: "We've seen higher conversion on donation pages after adding the badge.",
      name: "Sarah Chen",
      role: "Product Lead",
      org: "GiveWell Foundation",
      initial: "SC",
    },
    {
      quote: "Impact Engine helped us build donor trust with transparent ratings.",
      name: "Ahmed Hassan",
      role: "Director",
      org: "Helping Hands Charity",
      initial: "AH",
    },
    {
      quote: "The API is so simple. We integrated the badge in under an hour.",
      name: "James Wilson",
      role: "CTO",
      org: "DonateNow",
      initial: "JW",
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-pink-400" />
            <span className="text-xl font-bold text-gray-900">Impact Engine</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#badge" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Badge
            </a>
            <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              FAQ
            </a>
            <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </a>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6">
              Get Early Access
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-sky-50 to-mint-50 opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Donate with confidence.
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Transparent, verifiable charity scores to help every donation do more good.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
                  Get Early Access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="ghost" className="rounded-full px-8 border-2 border-gray-200 hover:border-gray-300" asChild>
                  <Link href="/search">
                    Search Charities
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" className="rounded-full px-8 border-2 border-gray-200 hover:border-gray-300">
                  <a href="#badge">See the Badge</a>
                </Button>
              </div>
              <div className="pt-8 border-t border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-4">Trusted By</p>
                <div className="flex gap-8 items-center">
                  <span className="text-lg font-semibold text-gray-400">Mercy Mission</span>
                  <span className="text-lg font-semibold text-gray-400">Charity Right</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Shield className="h-12 w-12 text-emerald-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Live Badge Preview</p>
                      <p className="text-sm text-gray-500">Real-time charity rating</p>
                    </div>
                  </div>
                  <div className="flex justify-center py-8">
                    <BadgePreview theme="pastel" rating="Green" size="large" />
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Auto-updates • Accessible • Fast
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-pink-50 to-white rounded-3xl p-8 border-2 border-pink-100 hover:border-pink-200 transition-all hover:-translate-y-1 cursor-pointer">
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-7 w-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent Scores</h3>
              <p className="text-gray-600 leading-relaxed">
                Understand finances, operations, and compliance at a glance.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-sky-50 to-white rounded-3xl p-8 border-2 border-sky-100 hover:border-sky-200 transition-all hover:-translate-y-1 cursor-pointer">
              <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="h-7 w-7 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Independent & Consistent</h3>
              <p className="text-gray-600 leading-relaxed">
                Standardised ratings you can compare across charities.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-8 border-2 border-emerald-100 hover:border-emerald-200 transition-all hover:-translate-y-1 cursor-pointer">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Built for Developers</h3>
              <p className="text-gray-600 leading-relaxed">
                Drop-in badge, simple API, instant credibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Badge Showcase */}
      <section id="badge" className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Embed the Impact Badge in seconds.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Display a charity's rating on your site or app. Auto-updates and accessible by design.
            </p>
          </div>

          {/* Badge Theme Selector */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setSelectedBadgeTheme("light")}
              className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                selectedBadgeTheme === "light"
                  ? "bg-white border-2 border-gray-900 shadow-lg"
                  : "bg-white border-2 border-gray-200 hover:border-gray-300"
              }`}
            >
              <BadgePreview theme="light" rating="Green" size="small" />
            </button>
            <button
              onClick={() => setSelectedBadgeTheme("dark")}
              className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                selectedBadgeTheme === "dark"
                  ? "bg-gray-900 border-2 border-gray-900 shadow-lg"
                  : "bg-gray-900 border-2 border-gray-700 hover:border-gray-600"
              }`}
            >
              <BadgePreview theme="dark" rating="Green" size="small" />
            </button>
            <button
              onClick={() => setSelectedBadgeTheme("pastel")}
              className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                selectedBadgeTheme === "pastel"
                  ? "bg-emerald-50 border-2 border-emerald-300 shadow-lg"
                  : "bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-250"
              }`}
            >
              <BadgePreview theme="pastel" rating="Green" size="small" />
            </button>
          </div>

          {/* Code Snippets */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="react">React</TabsTrigger>
                <TabsTrigger value="markdown">Markdown</TabsTrigger>
              </TabsList>
              <TabsContent value="html">
                <CodeBlock code={codeSnippets.html} language="html" />
              </TabsContent>
              <TabsContent value="react">
                <CodeBlock code={codeSnippets.react} language="jsx" />
              </TabsContent>
              <TabsContent value="markdown">
                <CodeBlock code={codeSnippets.markdown} language="markdown" />
              </TabsContent>
            </Tabs>
            <p className="text-sm text-gray-500 mt-6 text-center">
              Badges are accessible (ARIA-labeled), localised, and cached for speed.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            
            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Collect & Verify</h3>
              <p className="text-gray-600">
                We ingest filings and public data.
              </p>
            </div>

            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Score & Explain</h3>
              <p className="text-gray-600">
                Clear ratings with plain-English explanations.
              </p>
            </div>

            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Embed & Share</h3>
              <p className="text-gray-600">
                Add the badge. Build donor trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-pink-50 via-sky-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-12 shadow-xl border-2 border-gray-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-sky-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                {testimonials[testimonialIndex].initial}
              </div>
              <blockquote className="text-2xl font-medium text-gray-900 mb-6">
                "{testimonials[testimonialIndex].quote}"
              </blockquote>
              <div>
                <p className="font-semibold text-gray-900">{testimonials[testimonialIndex].name}</p>
                <p className="text-sm text-gray-600">
                  {testimonials[testimonialIndex].role} • {testimonials[testimonialIndex].org}
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setTestimonialIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === testimonialIndex ? "bg-gray-900 w-8" : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-gray-50 rounded-2xl px-6 border-0">
              <AccordionTrigger className="text-left hover:no-underline">
                What does the rating mean?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Our ratings assess charities across financial health, operational efficiency, and compliance. 
                Green indicates strong performance, Amber suggests areas for improvement, and Red signals concerns 
                that donors should be aware of.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-gray-50 rounded-2xl px-6 border-0">
              <AccordionTrigger className="text-left hover:no-underline">
                Is the badge free?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes! We offer a free developer tier that includes the embeddable badge and basic API access. 
                Advanced analytics and custom integrations are available in our Pro tier.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-gray-50 rounded-2xl px-6 border-0">
              <AccordionTrigger className="text-left hover:no-underline">
                How often do ratings update?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Ratings are updated annually when charities file their returns, and more frequently if significant 
                events occur. The badge automatically reflects the latest rating.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-gray-50 rounded-2xl px-6 border-0">
              <AccordionTrigger className="text-left hover:no-underline">
                Can I customise the badge?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Absolutely! Choose from Light, Dark, or Pastel themes, adjust the size, and match it to your brand. 
                Pro tier users can fully customize colors and styling.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to build trust?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 shadow-lg">
                Get Early Access
              </Button>
              <Button size="lg" variant="ghost" className="text-white border-2 border-white hover:bg-white/10 rounded-full px-8">
                See docs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
              <p className="text-sm text-gray-600">Built to help you give confidently.</p>
            </div>
            <div className="flex gap-8">
              <Link href="/search" className="text-sm text-gray-600 hover:text-gray-900">
                Search Charities
              </Link>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Docs
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
