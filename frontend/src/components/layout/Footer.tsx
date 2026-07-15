import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-white">
      <div className="page-container py-14 md:py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_0.7fr_0.9fr]">
          <div className="max-w-sm">
            <BrandLogo inverted />
            <p className="mt-5 text-sm leading-7 text-zinc-400">
              A trusted student mobility platform that makes commuting to and
              from LAU simpler, more affordable, and more connected.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              Platform
            </p>
            <div className="mt-5 grid gap-3 text-sm font-semibold text-zinc-300">
              <Link className="transition hover:text-white" to="/rides">
                Find a ride
              </Link>
              <Link className="transition hover:text-white" to="/rides/create">
                Offer a ride
              </Link>
              <Link className="transition hover:text-white" to="/about">
                About the platform
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              Support
            </p>
            <div className="mt-5 space-y-4 text-sm text-zinc-300">
              <a
                href="mailto:support@sharearide.lau.edu"
                className="flex items-start gap-3 transition hover:text-white"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-lau-green" />
                <span>support@sharearide.lau.edu</span>
              </a>
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-lau-green" />
                <span>Lebanese American University, Lebanon</span>
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 font-bold text-white"
              >
                Learn how it works <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} LAU Ride. All rights reserved.</p>
          <p>Built for the LAU student community.</p>
        </div>
      </div>
    </footer>
  );
}
