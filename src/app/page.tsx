"use client";
import { useAuth } from "@/components/providers/auth-provider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Shield, Zap, Clock, Wallet, Users, MessageSquare } from 'lucide-react';
import Loader from "@/components/ui/loader";

export default function Home() {
  const { loading: authLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/query');
    }
  }, [authLoading, user, router]);

  if (authLoading || user) {
    return <Loader text="Loading..." />;
  }

  return <LandingPage />;
}

const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            <main className="flex-grow">
                <HeroSection />
                <TrustSignals />
                <WhyAIrena />
                <Testimonials />
            </main>
        </div>
    )
}

const HeroSection = () => (
    <section className="text-center py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Compare top AI models. <br className="hidden md:inline" /> Pick the best answer. <span className="text-blue-600">Supercharge your work.</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Get instant, side-by-side answers from GPT-4 and Gemini in one click. Smarter research. Zero confusion.
            </p>
            <Link href="/login" className="mt-8 inline-block bg-blue-600 text-white font-bold text-lg rounded-lg px-8 py-4 transition-transform transform hover:scale-105 shadow-lg hover:shadow-xl">
                Sign Up Free
            </Link>
             <div className="mt-12 text-center">
                <div className="inline-block bg-gray-100 rounded-lg px-4 py-2">
                    <p className="text-sm text-gray-600 font-medium">✨ Your AI-powered research assistant is here</p>
                </div>
            </div>
        </div>
    </section>
);

const TrustSignals = () => (
    <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm transition-transform transform hover:-translate-y-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                        <Star className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-800">Backed by real users</h3>
                    <p className="mt-1 text-gray-500 text-sm">Praised for its speed, accuracy, and ease of use.</p>
                </div>
                <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm transition-transform transform hover:-translate-y-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                        <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-800">Your data stays private & secure</h3>
                     <p className="mt-1 text-gray-500 text-sm">We don&apos;t store your queries. Your data is yours.</p>
                </div>
                <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm transition-transform transform hover:-translate-y-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                         <Zap className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-800">No hidden charges</h3>
                     <p className="mt-1 text-gray-500 text-sm">Pay only for what you use. No subscriptions, no surprises.</p>
                </div>
            </div>
        </div>
    </section>
);

const WhyAIrena = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Why use AIrena?</h2>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                    AIrena helps you in your daily work and life, at a fraction of the cost.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard
                    icon={<Clock className="h-8 w-8 text-blue-600" />}
                    title="Save Hours Daily"
                    description="Compare answers from the world's best AIs, side-by-side. No more tab-switching."
                />
                <FeatureCard
                    icon={<Wallet className="h-8 w-8 text-blue-600" />}
                    title="Affordable Pricing"
                    description="Transparent, pay-as-you-go. No hidden fees, just credits for what you use."
                />
                <FeatureCard
                    icon={<Zap className="h-8 w-8 text-blue-600" />}
                    title="One App For Everything"
                    description="Write emails, brainstorm, code, translate, and research faster. All in one place."
                />
                <FeatureCard
                    icon={<Users className="h-8 w-8 text-blue-600" />}
                    title="For Everyone"
                    description="Perfect for students, job-seekers, creators, and busy professionals alike."
                />
            </div>
        </div>
    </section>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-gray-50 p-6 rounded-xl text-center flex flex-col items-center border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const Testimonials = () => (
     <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Loved by Professionals</h2>
                <p className="mt-3 text-lg text-gray-600">Don&apos;t just take our word for it. Here&apos;s what people are saying.</p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <TestimonialCard
                    quote="AIrena has become my go-to for research. The comparison feature is a game-changer and saves me hours."
                    name="Nikhila."
                    title="Marketing Manager"
                />
                 <TestimonialCard
                    quote="As a Engineer, I'm constantly comparing documentation. This tool makes it incredibly fast and efficient."
                    name="BNKR."
                    title="Engineer"
                />
                 <TestimonialCard
                    quote="The simple credit system is fantastic. I'm not locked into a subscription and only pay for what I actually use."
                    name="Abhiram."
                    title="Freelance Writer"
                />
            </div>
        </div>
    </section>
);

const TestimonialCard = ({ quote, name, title }: { quote: string, name: string, title: string }) => (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col">
        <MessageSquare className="w-8 h-8 text-blue-500 mb-4" />
        <p className="text-gray-700 mb-6 flex-grow">&ldquo;{quote}&rdquo;</p>
        <div>
            <p className="font-bold text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{title}</p>
        </div>
    </div>
);

