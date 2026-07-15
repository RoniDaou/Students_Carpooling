import { Link } from "react-router-dom";
import {
  ArrowRight,
  Car,
  CheckCircle2,
  Leaf,
  MapPin,
  Route,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <Layout>
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="subtle-grid absolute inset-0 opacity-60" />
        <div className="absolute -right-20 top-0 h-96 w-96 rounded-full bg-lau-green/25 blur-[120px]" />
        <div className="page-container relative grid min-h-[520px] items-center gap-12 py-16 lg:grid-cols-[1fr_0.8fr] lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white/70">
              About LAU Ride
            </span>
            <h1 className="mt-7 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-[-0.05em] sm:text-5xl md:text-6xl">
              A more connected way for students to commute.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              LAU Ride connects student drivers with passengers traveling to and
              from campus, placing trip details, ride requests, and coordination
              in one clear digital experience.
            </p>
          </div>

          <div className="map-grid relative rounded-[2rem] bg-[#eef1ed] p-6 text-zinc-950 shadow-[0_28px_90px_rgba(0,0,0,0.3)]">
            <div className="rounded-[1.4rem] bg-white p-6 shadow-[0_16px_45px_rgba(14,25,20,0.12)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">Shared journey</p>
                  <h2 className="mt-2 text-xl font-extrabold">Home to campus</h2>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-lau-green text-white">
                  <Car className="h-5 w-5" />
                </span>
              </div>
              <div className="relative mt-7 grid grid-cols-[14px_1fr] gap-x-3 gap-y-5">
                <div className="absolute bottom-2 left-[6px] top-2 w-px bg-zinc-200" />
                <span className="route-dot mt-1" />
                <div>
                  <p className="text-xs text-zinc-400">Pickup</p>
                  <p className="font-bold">Student neighborhood</p>
                </div>
                <span className="route-dot-dark mt-1" />
                <div>
                  <p className="text-xs text-zinc-400">Destination</p>
                  <p className="font-bold">LAU campus</p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-lau-light p-3 text-sm font-bold text-lau-green">
                <ShieldCheck className="h-4 w-4" /> University-focused community
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section bg-white">
        <div className="page-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <span className="eyebrow">Our purpose</span>
            <h2 className="section-title mt-4">Transportation that works better for student life.</h2>
            <p className="section-copy">
              Daily commuting can be expensive, time-consuming, and difficult to
              coordinate. LAU Ride gives students a structured way to share
              available seats and find routes that fit their schedules.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                icon: WalletCards,
                title: "More affordable",
                copy: "Ride sharing can distribute fuel and parking costs across more than one student.",
              },
              {
                icon: ShieldCheck,
                title: "More trusted",
                copy: "The experience is built around university information and student verification.",
              },
              {
                icon: Users,
                title: "More connected",
                copy: "Students can coordinate with classmates and build stronger campus connections.",
              },
              {
                icon: Leaf,
                title: "More sustainable",
                copy: "Shared trips can reduce the number of individual cars used for the same commute.",
              },
            ].map(({ icon: Icon, title, copy }) => (
              <article key={title} className="surface p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-zinc-950 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-zinc-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section bg-background">
        <div className="page-container">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">How the platform works</span>
            <h2 className="section-title mt-4">One clear flow from route to ride.</h2>
            <p className="section-copy mx-auto">
              The platform keeps each step focused and understandable for both
              drivers and passengers.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              {
                number: "01",
                icon: MapPin,
                title: "Publish or find a route",
                copy: "Drivers provide pickup, destination, schedule, route, and available seats. Passengers search the live ride board.",
              },
              {
                number: "02",
                icon: Route,
                title: "Review the trip",
                copy: "Passengers open the ride to review the driver, timing, vehicle, route, notes, and seat availability.",
              },
              {
                number: "03",
                icon: CheckCircle2,
                title: "Request and coordinate",
                copy: "The passenger sends a request. The driver accepts or rejects it, and the updated status appears automatically.",
              },
            ].map(({ number, icon: Icon, title, copy }) => (
              <article key={number} className="surface relative overflow-hidden p-7">
                <span className="absolute right-5 top-3 text-6xl font-black tracking-[-0.08em] text-zinc-100">
                  {number}
                </span>
                <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-lau-light text-lau-green">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="relative mt-7 text-xl font-bold text-zinc-950">{title}</h3>
                <p className="relative mt-3 text-sm leading-7 text-zinc-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-lau-green text-white">
        <div className="page-container grid gap-8 py-16 md:grid-cols-[1fr_auto] md:items-center md:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/60">Start your journey</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Find a seat or make yours available.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/75">
              Join the platform and make campus transportation easier for yourself and the wider LAU community.
            </p>
          </div>
          <Button asChild size="lg" className="bg-white text-lau-green hover:bg-zinc-100">
            <Link to="/register">
              Create an account <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
