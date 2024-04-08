import { Link } from 'react-router-dom';

const GettingStarted = () => {
    return (<>
        <div className='flex items-center lg:gap-12 gap-4 justify-end bg-gray-900 text-gray-100 lg:text-xl sm:text-md h-16 px-8 z-100'>
            <h1 className=''>Home</h1>
            <h1 className='hover:text-orange-700'>Contact us</h1>
            <h1 className='hover:text-orange-700'>Testimonials</h1>
            <h1 className='hover:text-orange-700'>Developer</h1>
        </div>
        <div className="min-h-svh min-h-full text-gray-700 flex justify-center pb-32 items-center">
            <div className="absolute inset-0 w-full h-full">
                <img src="https://img.freepik.com/free-vector/blogging-concept-illustration_114360-1038.jpg?w=740" alt="Blogging Community" className="w-fit h-fit mt-16 object-cover opacity-50" />
            </div>

            <div className="relative z-10 font-['Georgia'] flex flex-col justify-center items-center space-y-4 px-4 pr-8 text-gray-950">
                <div className='flex'>
                    <img src="https://www.svgrepo.com/show/54787/bebo.svg" alt="Bebo Logo" className='h-20 w-20 lg:h-36 lg:w-36 bg-orange-700' />
                    <p className="text-6xl lg:text-7xl lg:text-9xl text-orange-700  pt-3">loggery.</p>
                </div>
                <div className='flex flex-col justify-center items-center space-y-4'>
                    <h1 className="lg:text-5xl text-4xl font-bold text-center">Connect, Create, Share</h1>
                    <p className="text-xl text-center">Join the vibrant <span className='text-orange-800'>Bloggery</span> community and bring your stories to life.</p>
                    <Link to="/register" className="bg-gray-800 text-white px-9 py-5 rounded-lg font-['Cinzel'] font-medium text-lg lg:text-2xl hover:bg-orange-800 transition-colors">Create Your First Post</Link>

                </div>
            </div>
        </div>
        <hr />

        <div className="flex flex-col items-center my-8">
            <h1 className="text-5xl lg:text-8xl text-orange-700 font-['Georgia']">How it works</h1><br />
            <iframe
                className="w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/2 h-64 md:h-96"
                src="https://www.youtube.com/embed/kyjpj1RrsyI"
                title="Bloggery guide"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
            </iframe>
        </div>

    </>);
};

export default GettingStarted;
