/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self';",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "no-referrer-when-downgrade",
  },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=()",
  },
  {
    key: "Access-Control-Allow-Origin",
    value: "*",
  },
  {
    key: "Access-Control-Allow-Methods",
    value: "GET, POST, PUT, DELETE, OPTIONS",
  },
  {
    key: "Access-Control-Allow-Headers",
    value: "Content-Type, Authorization, X-Requested-With",
  },
];

const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
    PROGRAM_CODE: process.env.PROGRAM_CODE,
  },
  output: "standalone",
  transpilePackages: [
    "rrule",
    "@devexpress/dx-react-core",
    "@devexpress/dx-scheduler-core",
    "@devexpress/dx-react-scheduler-material-ui",
    "@devexpress/dx-react-scheduler",
    "@devexpress/dx-react-grid-material-ui",
    "@mui/icons-material",
    "@mui/x-date-pickers",
  ],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
