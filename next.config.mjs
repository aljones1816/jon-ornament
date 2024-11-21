/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'a.espncdn.com', // Only the hostname
                port: '', // Leave empty for default port
                pathname: '/i/teamlogos/nfl/**', // Matches all paths under /i/teamlogos/nfl/
            },
        ],
    },
};

export default nextConfig;
