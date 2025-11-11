import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiPost, extractError } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OmeraLogo from "@/assets/Omera-logo.png";
import heroHotel from "@/assets/hero-hotel.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const navigate = useNavigate();
  const imageRef = useRef<HTMLDivElement>(null);

  // Subtle parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const moveX = (clientX - innerWidth / 2) / 50;
      const moveY = (clientY - innerHeight / 2) / 50;

      imageRef.current.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const { mutateAsync: loginMutate } = useMutation({
    mutationFn: async () =>
      apiPost<
        {
          success: true;
          data: { token: string; user: { id: string; role: string } };
        },
        { email: string; password: string }
      >("/auth/login", { email, password }),
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await loginMutate();
      const token = res?.data?.token;
      if (token) {
        localStorage.setItem("auth_token", token);
        navigate("/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      alert(`Login failed: ${extractError(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <Card className="w-full max-w-md border-stone-200/60 bg-white/95 backdrop-blur-xl shadow-2xl shadow-amber-900/5">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full blur-md opacity-20" />
              <img
                src={OmeraLogo}
                alt="Omera"
                className="relative h-20 w-20 mx-auto rounded-full border-4 border-white bg-white p-2 shadow-lg"
              />
            </div>
          </div>

          <CardHeader className="space-y-4 text-center pt-16 pb-4">
            <div className="space-y-3">
              <CardTitle className="text-3xl font-serif font-light text-stone-800 tracking-wide">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base text-stone-600 font-light tracking-wide">
                Sign in to your account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-stone-700 tracking-wide"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput(null)}
                    className={`h-12 transition-all duration-300 bg-white border-stone-300 text-stone-800 placeholder-stone-400 ${
                      focusedInput === "email"
                        ? "border-amber-500 shadow-lg shadow-amber-500/10 bg-amber-50/30"
                        : "hover:border-stone-400"
                    }`}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-stone-700 tracking-wide"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                    className={`h-12 transition-all duration-300 bg-white border-stone-300 text-stone-800 placeholder-stone-400 ${
                      focusedInput === "password"
                        ? "border-amber-500 shadow-lg shadow-amber-500/10 bg-amber-50/30"
                        : "hover:border-stone-400"
                    }`}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium tracking-wide transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-600/20 border-0"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Hero Image Focus */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-stone-900">
        {/* Main Image Container */}
        <div
          ref={imageRef}
          className="absolute inset-0 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url(${heroHotel})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Minimal Gradient Overlay - Just to enhance text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-stone-900/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-900/10 to-stone-900/30" />

        {/* Elegant Corner Accents */}
        <div className="absolute top-8 right-8 z-20">
          <div className="text-right">
            <div className="text-amber-400 text-sm font-light tracking-widest mb-1">
              LUXURY
            </div>
            <div className="w-12 h-0.5 bg-amber-400 ml-auto"></div>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 z-20">
          <div className="text-left">
            <div className="w-12 h-0.5 bg-amber-400 mb-1"></div>
            <div className="text-amber-400 text-sm font-light tracking-widest">
              HOSPITALITY
            </div>
          </div>
        </div>

        {/* Minimal Branding - Bottom Center */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 text-center">
          <div className="text-white space-y-3">
            <div className="text-4xl font-serif font-light tracking-widest">
              OMERA
            </div>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-8 h-px bg-amber-400"></div>
              <div className="text-amber-400 text-sm font-light tracking-widest">
                EST. 1985
              </div>
              <div className="w-8 h-px bg-amber-400"></div>
            </div>
          </div>
        </div>

        {/* Top Left Minimal Text */}
        <div className="absolute top-12 left-12 z-20 max-w-xs">
          <div className="text-amber-100/90 text-lg font-light leading-relaxed">
            Experience unparalleled luxury in the heart of the city
          </div>
        </div>

        {/* Floating Rating Badge */}
        <div className="absolute top-1/4 right-12 z-20 transform -translate-y-1/2">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
            <div className="flex items-center space-x-2">
              <div className="text-amber-400 text-lg">★★★★★</div>
              <div className="text-white text-sm font-light">5-Star</div>
            </div>
          </div>
        </div>

        {/* Subtle Border Glow */}
        <div className="absolute inset-0 border-2 border-transparent">
          <div className="absolute inset-0 border border-amber-400/10 rounded-lg m-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
