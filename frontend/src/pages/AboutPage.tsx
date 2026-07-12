import { Car, Leaf, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <Layout>
      <main>
        <section className="bg-gradient-to-r from-lau-green to-lau-dark py-16 text-white">
          <div className="container mx-auto max-w-4xl px-6 text-center">
            <h1 className="mb-5 text-4xl font-bold md:text-5xl">
              About Share a Ride
            </h1>

            <p className="mx-auto max-w-3xl text-lg leading-8 md:text-xl">
              Share a Ride is a student carpooling platform created for Lebanese
              American University students. It connects students travelling to
              and from campus, allowing drivers to offer available seats and
              passengers to find suitable rides in one simple and convenient
              place.
            </p>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="mb-14 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                Our Purpose
              </h2>

              <p className="mx-auto max-w-3xl text-lg leading-8 text-gray-600">
                The platform aims to make student transportation safer, more
                affordable, and more organized. By sharing rides, students can
                reduce transportation costs, decrease the number of cars on the
                road, limit traffic around campus, and build stronger
                connections within the LAU community.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <Car className="mb-3 h-10 w-10 text-lau-green" />
                  <CardTitle>Easy Ride Sharing</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="leading-7 text-gray-600">
                    Drivers can offer rides by providing the route, date, time,
                    destination, and available seats. Passengers can browse
                    available rides and request the option that suits them best.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <ShieldCheck className="mb-3 h-10 w-10 text-lau-green" />
                  <CardTitle>Student-Focused Safety</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="leading-7 text-gray-600">
                    The platform is designed specifically for the LAU student
                    community and uses student information and identification
                    during registration to create a more trusted environment.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="mb-3 h-10 w-10 text-lau-green" />
                  <CardTitle>Stronger Community</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="leading-7 text-gray-600">
                    Sharing transportation helps students meet classmates,
                    support one another, and make commuting a more social and
                    comfortable experience.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Leaf className="mb-3 h-10 w-10 text-lau-green" />
                  <CardTitle>More Sustainable Travel</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="leading-7 text-gray-600">
                    Fewer individual cars mean lower fuel consumption, reduced
                    emissions, less traffic, and a more sustainable way to
                    travel to university.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-14 rounded-xl bg-lau-light p-8 text-center">
              <h2 className="mb-3 text-2xl font-bold">
                Ready to share your journey?
              </h2>

              <p className="mb-6 text-gray-600">
                Find an available ride or offer a seat to another LAU student.
              </p>

              <Button asChild className="bg-lau-green hover:bg-lau-dark">
                <Link to="/rides">Find a Ride</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
