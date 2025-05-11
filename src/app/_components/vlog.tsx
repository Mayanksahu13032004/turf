'use client'

const Vlog=()=>{
 return(
 <div className="bg-gray-100 p-6 rounded-lg">
      {/* Heading */}
      <h2 className="text-2xl font-bold mb-4">Blogs to Keep You Fit!</h2>

      {/* Blog Section */}
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {/* Blog Card 1 */}
        <div className="min-w-[220px] bg-white rounded-lg shadow-md">
          <img
            src="/volley.png.jpg"
            alt="Volleyball"
            className="w-full h-32 object-cover rounded-t-lg"
          />
          <div className="p-3">
            <h3 className="text-md font-semibold">Learn Volleyball in 5!</h3>
          </div>
        </div>

        {/* Blog Card 2 */}
        <div className="min-w-[220px] bg-white rounded-lg shadow-md">
          <img
            src="/images/cricketers.jpg"
            alt="Cricketers"
            className="w-full h-32 object-cover rounded-t-lg"
          />
          <div className="p-3">
            <h3 className="text-md font-semibold">Names Celebrated by Cr...</h3>
          </div>
        </div>

        {/* Blog Card 3 */}
        <div className="min-w-[220px] bg-white rounded-lg shadow-md">
          <img
            src="/images/badminton.jpg"
            alt="Badminton"
            className="w-full h-32 object-cover rounded-t-lg"
          />
          <div className="p-3">
            <h3 className="text-md font-semibold">Easy-to-Learn Badminto...</h3>
          </div>
        </div>

        {/* Blog Card 4 */}
        <div className="min-w-[220px] bg-white rounded-lg shadow-md">
          <img
            src="/images/golf.jpg"
            alt="Golf"
            className="w-full h-32 object-cover rounded-t-lg"
          />
          <div className="p-3">
            <h3 className="text-md font-semibold">A Spectator’s Guide to G...</h3>
          </div>
        </div>

        {/* QR Download Box */}
        <div className="min-w-[220px] bg-gradient-to-br from-gray-800 to-gray-600 text-white rounded-lg p-4 flex flex-col items-center justify-center">
          <img
            src="/images/qr-code.png"
            alt="QR Code"
            className="w-20 h-20 mb-2"
          />
          <p className="font-semibold text-sm text-center">
            DOWNLOAD
            <br />
            THE APP
          </p>
        </div>
      </div>
    </div>
    )
}
export default Vlog;