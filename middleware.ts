import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/login(.*)',
  '/register(.*)',
  '/api/uploadthing(.*)', // Exclude Uploadthing route from Clerk middleware
]);

export default clerkMiddleware(async (auth, request) => {
  console.log("Middleware running for:", request.url);

  if (!isPublicRoute(request)) {
    await auth.protect();
    console.log("Protected route accessed:", request.url);
  } else {
    console.log("Public route accessed:", request.url);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};