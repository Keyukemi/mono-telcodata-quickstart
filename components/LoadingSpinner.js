import Layout from "./Layout";

function LoadingSpinner() {
    return (
        <Layout>
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-gray-900"></div>
            </div>
        </Layout>
    );
  }
  
export default LoadingSpinner;
  