/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['onnxruntime-node', 'pdf2json']
    }
};

export default nextConfig;
