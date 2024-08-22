/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
        };
        
        // Ignore swisseph on the client-side
        config.externals.push('swisseph');
      }
      
      // Ignore .node files
      config.module.rules.push({
        test: /\.node$/,
        use: 'node-loader',
      });
  
      return config;
    },
  };
  
  export default nextConfig;