import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Pencil,
  Brain,
  Zap,
  ChevronDown,
  ArrowRight,
  Play,
  CheckCircle2,
  Users,
  Star,
  Github,
  Menu,
  X,
  Instagram,
  Twitch,
} from "lucide-react";

// ============================================
// TYPES
// ============================================
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

// ============================================
// INTERSECTION OBSERVER HOOK
// ============================================
function useIntersectionObserver(
  options: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }
) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible };
}

// ============================================
// ANIMATED SKETCH SVG COMPONENT
// ============================================
function AnimatedSketchSVG() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Grid lines */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="hsl(30, 10%, 85%)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#grid)" />

      {/* Hand-drawn style math expression: 2+3 */}
      <g className="animate-draw-line" style={{ animationDelay: "0.5s" }}>
        <path
          d="
      M 80 90
      Q 95 70 115 90
      Q 120 100 105 110
      L 85 120
      L 120 120
    "
          stroke="hsl(30, 10%, 25%)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Plus sign */}
      <g className="animate-draw-line" style={{ animationDelay: "1s" }}>
        <path
          d="M 140 100 L 170 100"
          stroke="hsl(30, 10%, 25%)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 155 85 L 155 115"
          stroke="hsl(30, 10%, 25%)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Number 3 */}
      <g className="animate-draw-line" style={{ animationDelay: "1.5s" }}>
        <path
          d="M 195 85 Q 220 85 220 97 Q 220 105 200 105 Q 220 105 220 115 Q 220 130 195 130"
          stroke="hsl(30, 10%, 25%)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Equals sign */}
      <g className="animate-draw-line" style={{ animationDelay: "2s" }}>
        <path
          d="M 250 95 L 280 95"
          stroke="hsl(24, 75%, 50%)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 250 110 L 280 110"
          stroke="hsl(24, 75%, 50%)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Number 5 (result) */}
      <g className="animate-draw-line" style={{ animationDelay: "2.5s" }}>
        <path
          d="M 330 85 L 305 85 L 305 100 Q 330 95 330 110 Q 330 130 305 130"
          stroke="hsl(24, 75%, 50%)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Sparkle decorations */}
      <g className="animate-pulse-soft" style={{ animationDelay: "3s" }}>
        <circle cx="350" cy="80" r="3" fill="hsl(24, 75%, 50%)" />
        <circle cx="360" cy="90" r="2" fill="hsl(24, 75%, 60%)" />
        <circle cx="345" cy="95" r="2" fill="hsl(24, 75%, 55%)" />
      </g>

      {/* Pencil illustration */}
      <g transform="translate(50, 180) rotate(-30)" className="animate-float">
        <rect
          x="0"
          y="0"
          width="80"
          height="12"
          rx="2"
          fill="hsl(45, 80%, 60%)"
        />
        <polygon points="80,0 95,6 80,12" fill="hsl(30, 30%, 75%)" />
        <polygon points="95,6 100,6 95,3 95,9" fill="hsl(30, 10%, 25%)" />
        <rect
          x="0"
          y="0"
          width="15"
          height="12"
          rx="2"
          fill="hsl(350, 60%, 55%)"
        />
      </g>
    </svg>
  );
}

// ============================================
// FEATURE CARD COMPONENT
// ============================================
function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`card-sketch group ${isVisible ? "revealed" : ""}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      <div className="w-12 h-12 rounded-xl bg-[hsl(24,75%,50%,0.1)] flex items-center justify-center mb-4 group-hover:bg-[hsl(24,75%,50%,0.15)] transition-colors">
        <div className="text-[hsl(24,75%,50%)]">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-[hsl(30,10%,20%)] mb-2">
        {title}
      </h3>
      <p className="text-[hsl(30,10%,45%)] leading-relaxed">{description}</p>
    </div>
  );
}

// ============================================
// STEP CARD COMPONENT
// ============================================
function StepCard({ number, title, description, icon }: StepCardProps) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-[hsl(24,75%,50%)] text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
        {number}
      </div>
      <div className="w-10 h-10 rounded-lg bg-[hsl(40,30%,97%)] border border-[hsl(30,15%,85%)] flex items-center justify-center mb-3 -mt-2">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[hsl(30,10%,20%)] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[hsl(30,10%,45%)] max-w-[200px]">
        {description}
      </p>
    </div>
  );
}

// ============================================
// FAQ ITEM COMPONENT
// ============================================
function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-[hsl(30,15%,85%)] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-[hsl(30,10%,20%)] pr-4 group-hover:text-[hsl(24,75%,50%)] transition-colors">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[hsl(30,10%,55%)] transition-transform duration-300 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-48 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-[hsl(30,10%,45%)] leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// ============================================
// TESTIMONIAL CARD COMPONENT
// ============================================
function TestimonialCard({ quote, author, role, avatar }: TestimonialProps) {
  return (
    <div className="card-sketch">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 fill-[hsl(45,90%,55%)] text-[hsl(45,90%,55%)]"
          />
        ))}
      </div>
      <p className="text-[hsl(30,10%,35%)] mb-4 italic leading-relaxed">
        "{quote}"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[hsl(24,75%,50%,0.2)] flex items-center justify-center text-[hsl(24,75%,50%)] font-semibold">
          {avatar}
        </div>
        <div>
          <p className="font-medium text-[hsl(30,10%,20%)]">{author}</p>
          <p className="text-sm text-[hsl(30,10%,55%)]">{role}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN LANDING PAGE COMPONENT
// ============================================
export default function Landing() {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { ref: featuresRef, isVisible: featuresVisible } =
    useIntersectionObserver();
  const { ref: howItWorksRef, isVisible: howItWorksVisible } =
    useIntersectionObserver();

  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const features = [
    {
      icon: <Pencil className="w-6 h-6" />,
      title: "Natural Drawing",
      description:
        "Draw math expressions naturally with your mouse, stylus, or finger. No typing required.",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Smart Recognition",
      description:
        "Advanced AI instantly recognizes handwritten numbers, symbols, and mathematical operations.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Results",
      description:
        "Get accurate calculations in milliseconds. From simple arithmetic to complex equations.",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Step-by-Step",
      description:
        "Understand how solutions are reached with clear, visual step-by-step breakdowns.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Draw",
      description: "Sketch your math problem on the canvas",
      icon: <Pencil className="w-5 h-5 text-[hsl(24,75%,50%)]" />,
    },
    {
      number: "2",
      title: "Analyze",
      description: "AI instantly recognizes your expression",
      icon: <Brain className="w-5 h-5 text-[hsl(180,35%,35%)]" />,
    },
    {
      number: "3",
      title: "Solve",
      description: "Get the answer with full explanation",
      icon: <CheckCircle2 className="w-5 h-5 text-[hsl(140,50%,40%)]" />,
    },
  ];

  const faqs = [
    {
      question: "What types of math can CogniSketch solve?",
      answer:
        "CogniSketch can handle arithmetic operations (+, -, ×, ÷), fractions, square roots, exponents, and basic algebraic expressions. We're constantly adding support for more complex mathematics.",
    },
    {
      question: "Do I need to draw perfectly?",
      answer:
        "Not at all! Our AI is trained on thousands of handwriting styles and can understand even messy sketches. Just draw naturally and let the AI figure out the rest.",
    },
    {
      question: "Is CogniSketch free to use?",
      answer:
        "Yes! CogniSketch is completely free to use. Simply click 'Start Drawing' and begin solving math problems instantly.",
    },
    {
      question: "Does it work on mobile devices?",
      answer:
        "Absolutely! CogniSketch is fully responsive and works great on tablets and smartphones. Use your finger or stylus to draw directly on your device.",
    },
    {
      question: "How accurate is the AI recognition?",
      answer:
        "Our AI achieves over 80% accuracy on standard mathematical expressions. For best results, draw clearly and give each symbol enough space.",
    },
  ];

  const testimonials = [
    {
      quote:
        "CogniSketch has transformed how I help my students understand math. They love drawing problems instead of typing them!",
      author: "Sarah Chen",
      role: "Math Teacher",
      avatar: "SC",
    },
    {
      quote:
        "As someone who thinks visually, this tool finally makes math feel intuitive. I use it daily for quick calculations.",
      author: "Marcus Johnson",
      role: "Design Engineer",
      avatar: "MJ",
    },
    {
      quote:
        "My kids actually enjoy practicing math now. The instant feedback keeps them engaged and learning.",
      author: "Emily Rodriguez",
      role: "Parent",
      avatar: "ER",
    },
  ];

  return (
    <div className="min-h-screen paper-texture">
      {/* ============================================
          NAVIGATION
          ============================================ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(40,33%,94%,0.9)] backdrop-blur-md border-b border-[hsl(30,15%,85%)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[hsl(24,75%,50%)] flex items-center justify-center">
                <Pencil className="w-4 h-4 text-white" />
              </div>
              <span
                className="text-xl font-bold text-[hsl(30,10%,20%)]"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                CogniSketch
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-[hsl(30,10%,40%)] hover:text-[hsl(24,75%,50%)] transition-colors font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-[hsl(30,10%,40%)] hover:text-[hsl(24,75%,50%)] transition-colors font-medium"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-[hsl(30,10%,40%)] hover:text-[hsl(24,75%,50%)] transition-colors font-medium"
              >
                FAQ
              </button>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button
                onClick={() => navigate("/drawing")}
                className="btn-primary text-sm py-2 px-5"
              >
                Start Drawing
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[hsl(30,10%,40%)]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[hsl(40,30%,97%)] border-t border-[hsl(30,15%,85%)] py-4">
            <div className="flex flex-col gap-2 px-4">
              <button
                onClick={() => scrollToSection("features")}
                className="text-left py-2 text-[hsl(30,10%,40%)] hover:text-[hsl(24,75%,50%)] font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-left py-2 text-[hsl(30,10%,40%)] hover:text-[hsl(24,75%,50%)] font-medium"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-left py-2 text-[hsl(30,10%,40%)] hover:text-[hsl(24,75%,50%)] font-medium"
              >
                FAQ
              </button>
              <button
                onClick={() => navigate("/drawing")}
                className="btn-primary text-sm py-3 mt-2"
              >
                Start Drawing
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section
        ref={heroRef}
        className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Text */}
            <div className="text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(40,30%,97%)] border border-[hsl(30,15%,85%)] mb-6 animate-fade-up">
                <Users className="w-4 h-4 text-[hsl(24,75%,50%)]" />
                <span className="text-sm text-[hsl(30,10%,45%)]">
                  Loved by{" "}
                  {/* <span className="font-semibold text-[hsl(30,10%,25%)]">
                    100+
                  </span>{" "} */}
                  Students & Educators
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-display text-[hsl(30,10%,15%)] mb-6 animate-fade-up-delay-1">
                Turn Every{" "}
                <span className="pencil-underline text-[hsl(24,75%,50%)]">
                  Sketch
                </span>
                <br />
                Into a Solution
              </h1>

              {/* Subheadline */}
              <p className="text-body-lg text-[hsl(30,10%,45%)] mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-up-delay-2">
                Draw mathematical expressions naturally and let AI solve them
                instantly. No typing, no formulas—just sketch and learn.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up-delay-3">
                <button
                  onClick={() => navigate("/drawing")}
                  className="btn-primary flex items-center justify-center gap-2 text-lg"
                >
                  <Play className="w-5 h-5" />
                  Start Drawing Free
                </button>
                <button
                  onClick={() => scrollToSection("demo")}
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  See How It Works
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 mt-8 justify-center lg:justify-start animate-fade-up-delay-4">
                <div className="flex -space-x-2">
                  {["SC", "MJ", "ER", "AK"].map((initials, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-[hsl(24,75%,50%)] text-white text-xs font-semibold flex items-center justify-center border-2 border-[hsl(40,33%,94%)]"
                      style={{ opacity: 1 - i * 0.15 }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(4)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[hsl(45,90%,55%)] text-[hsl(45,90%,55%)]"
                    />
                  ))}
                  <span className="text-sm text-[hsl(30,10%,45%)] ml-1">
                    4/5 rating
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Animated Illustration */}
            <div className="relative animate-fade-up-delay-2">
              <div className="card-sketch p-4 sm:p-6 lg:p-8">
                <AnimatedSketchSVG />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 sm:bottom-4 sm:right-4 bg-white rounded-xl shadow-lg p-3 border border-[hsl(30,15%,85%)] animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[hsl(140,50%,45%)] flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[hsl(30,10%,55%)]">Accuracy</p>
                    <p className="text-sm font-bold text-[hsl(30,10%,20%)]">
                      80%+
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-12 lg:mt-16 animate-bounce">
            <button
              onClick={() => scrollToSection("features")}
              className="p-2 text-[hsl(30,10%,55%)] hover:text-[hsl(24,75%,50%)] transition-colors"
              aria-label="Scroll to features"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURES SECTION
          ============================================ */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div
            ref={featuresRef}
            className="text-center mb-16"
            style={{
              opacity: featuresVisible ? 1 : 0,
              transform: featuresVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[hsl(24,75%,50%,0.1)] text-[hsl(24,75%,50%)] text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-headline text-[hsl(30,10%,15%)] mb-4">
              Math Made Visual
            </h2>
            <p className="text-body-lg text-[hsl(30,10%,45%)] max-w-2xl mx-auto">
              Experience the future of mathematical problem-solving with our
              intuitive, AI-powered drawing interface.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Hand-drawn divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="hand-drawn-line" />
      </div>

      {/* ============================================
          HOW IT WORKS SECTION
          ============================================ */}
      <section
        id="how-it-works"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div
            ref={howItWorksRef}
            className="text-center mb-16"
            style={{
              opacity: howItWorksVisible ? 1 : 0,
              transform: howItWorksVisible
                ? "translateY(0)"
                : "translateY(30px)",
              transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[hsl(180,35%,35%,0.1)] text-[hsl(180,35%,35%)] text-sm font-medium mb-4">
              How It Works
            </span>
            <h2 className="text-headline text-[hsl(30,10%,15%)] mb-4">
              Three Simple Steps
            </h2>
            <p className="text-body-lg text-[hsl(30,10%,45%)] max-w-2xl mx-auto">
              From sketch to solution in seconds. No learning curve required.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-4 relative">
            {/* Connection Line (desktop only) */}
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-[hsl(24,75%,50%)] via-[hsl(30,15%,80%)] to-[hsl(140,50%,45%)]" />

            {steps.map((step, index) => (
              <StepCard
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/drawing")}
              className="btn-primary inline-flex items-center gap-2"
            >
              Try It Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Hand-drawn divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="hand-drawn-line" />
      </div>

      {/* ============================================
          TESTIMONIALS SECTION
          ============================================ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[hsl(45,90%,55%,0.2)] text-[hsl(35,80%,40%)] text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-headline text-[hsl(30,10%,15%)] mb-4">
              Loved by Learners
            </h2>
            <p className="text-body-lg text-[hsl(30,10%,45%)] max-w-2xl mx-auto">
              See what students, teachers, and parents are saying about
              CogniSketch.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                avatar={testimonial.avatar}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Hand-drawn divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="hand-drawn-line" />
      </div>

      {/* ============================================
          FAQ SECTION
          ============================================ */}
      <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[hsl(180,35%,35%,0.1)] text-[hsl(180,35%,35%)] text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-headline text-[hsl(30,10%,15%)] mb-4">
              Questions? Answers.
            </h2>
            <p className="text-body-lg text-[hsl(30,10%,45%)]">
              Everything you need to know about CogniSketch.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="card-sketch">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          FINAL CTA SECTION
          ============================================ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[hsl(30,10%,15%)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-headline text-white mb-6">
            Ready to Transform How You Do Math?
          </h2>
          <p className="text-body-lg text-[hsl(30,10%,70%)] mb-8 max-w-xl mx-auto">
            Join thousands of students and educators who are already learning
            smarter with CogniSketch.
          </p>
          <button
            onClick={() => navigate("/drawing")}
            className="btn-primary text-lg px-10 py-5 inline-flex items-center gap-3"
          >
            <Pencil className="w-5 h-5" />
            Start Drawing Free
          </button>
          <p className="text-sm text-[hsl(30,10%,55%)] mt-4">
            No sign-up required. Start solving instantly.
          </p>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[hsl(30,15%,85%)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[hsl(24,75%,50%)] flex items-center justify-center">
                  <Pencil className="w-4 h-4 text-white" />
                </div>
                <span
                  className="text-xl font-bold text-[hsl(30,10%,20%)]"
                  style={{ fontFamily: "'Crimson Pro', serif" }}
                >
                  CogniSketch
                </span>
              </div>
              <p className="text-[hsl(30,10%,45%)] max-w-xs mb-4">
                Making math visual, intuitive, and accessible for everyone
                through AI-powered drawing recognition.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/srixdev/"
                  className="w-10 h-10 rounded-lg bg-[hsl(40,30%,97%)] border border-[hsl(30,15%,85%)] flex items-center justify-center text-[hsl(30,10%,45%)] hover:text-[hsl(24,75%,50%)] hover:border-[hsl(24,75%,50%)] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.twitch.tv/sridineshh"
                  className="w-10 h-10 rounded-lg bg-[hsl(40,30%,97%)] border border-[hsl(30,15%,85%)] flex items-center justify-center text-[hsl(30,10%,45%)] hover:text-[hsl(24,75%,50%)] hover:border-[hsl(24,75%,50%)] transition-colors"
                  aria-label="Twitch"
                >
                  <Twitch className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/Sri-dinesh/CogniSketch"
                  className="w-10 h-10 rounded-lg bg-[hsl(40,30%,97%)] border border-[hsl(30,15%,85%)] flex items-center justify-center text-[hsl(30,10%,45%)] hover:text-[hsl(24,75%,50%)] hover:border-[hsl(24,75%,50%)] transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-[hsl(30,10%,20%)] mb-4">
                Product
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="text-[hsl(30,10%,45%)] hover:text-[hsl(24,75%,50%)] transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("demo")}
                    className="text-[hsl(30,10%,45%)] hover:text-[hsl(24,75%,50%)] transition-colors"
                  >
                    Demo
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("faq")}
                    className="text-[hsl(30,10%,45%)] hover:text-[hsl(24,75%,50%)] transition-colors"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[hsl(30,10%,20%)] mb-4">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-[hsl(30,10%,45%)] hover:text-[hsl(24,75%,50%)] transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[hsl(30,10%,45%)] hover:text-[hsl(24,75%,50%)] transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[hsl(30,10%,45%)] hover:text-[hsl(24,75%,50%)] transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-[hsl(30,15%,85%)] text-center">
            <p className="text-sm text-[hsl(30,10%,55%)]">
              © {new Date().getFullYear()} CogniSketch. All rights reserved.
              Made with ❤️ for learners everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
