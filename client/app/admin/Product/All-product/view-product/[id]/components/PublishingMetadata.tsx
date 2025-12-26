import React from 'react'

const PublishingMetadata = () => {
  return (
    <div className="space-y-4">
      {/* Publish Section */}
      <div className=" p-4 rounded-3xl border border-[#172D6D] bg-black/30 backdrop-blur-[500px]">
        <h3 className=" font-medium text-[#FFFFFF] text-[17px] mb-4">Publish</h3>
        <div className="space-y-4">
          <div>
            <select className="w-full px-3 py-3 rounded-lg border border-[#172D6D]  focus:outline-none  focus:ring-blue-500 focus:border-[#172D6D] text-white placeholder:text-sm text-sm  bg-black/30 backdrop-blur-[500px]" disabled>
              <option>Private</option>
              <option>Public</option>
              <option>Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Section */}
      <div className="border border-[#172D6D] bg-black/30 backdrop-blur-[500px] p-4 rounded-3xl">
        <h3 className="text-lg font-medium text-white mb-4">Category</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Enter Category...."
            className="w-full px-3 text-sm py-3   border border-[#172D6D] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 placeholder:text-sm"
            readOnly
          />
          <div>
            <h4 className="text-lg font-medium text-white mb-3">All categories</h4>
            <div className="border border-[#172D6D]  p-4 rounded-lg">
              <div className="max-h-32 overflow-y-auto">
                <div className="space-y-2">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${i}`}
                        className="w-4 h-4 text-white bg-transparent border border-white rounded focus:ring-white focus:ring-1 appearance-none checked:bg-white checked:after:content-['✓'] checked:after:text-black checked:after:absolute checked:after:text-xs checked:after:font-bold checked:after:leading-none checked:after:top-0.5 checked:after:left-0.5 relative"
                        disabled
                      />
                      <label htmlFor={`category-${i}`} className="ml-2 text-sm text-white">
                        Hip hop
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tags Section */}
      {/* <div className="border border-[#172D6D] bg-black/30 backdrop-blur-[500px] p-4 rounded-3xl">
        <h3 className="text-lg font-medium text-white mb-4">Tags</h3>
        <div className="space-y-3">
          <input
            type="text"
            className="w-full px-3 py-3 text-sm  border border-[#172D6D] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 placeholder:text-sm"
            readOnly
          />
          <div>
            <h4 className="text-lg font-medium text-white mb-3">All tags</h4>
            <div className="border border-[#172D6D]  p-4 rounded-lg">
              <div className="max-h-32 overflow-y-auto">
                <div className="space-y-2">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`tag-${i}`}
                        className="w-4 h-4 text-white bg-transparent border border-white rounded focus:ring-white focus:ring-1 appearance-none checked:bg-white checked:after:content-['✓'] checked:after:text-black checked:after:absolute checked:after:text-xs checked:after:font-bold checked:after:leading-none checked:after:top-0.5 checked:after:left-0.5 relative"
                        disabled
                      />
                      <label htmlFor={`tag-${i}`} className="ml-2 text-sm text-white">
                        Hip hop
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* SEO Settings */}
      {/* <div className="border border-[#172D6D] bg-black/30 backdrop-blur-[500px] p-4 rounded-3xl">
        <h3 className="text-lg font-medium text-white mb-4">SEO Setting</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
              SEO Title
            </label>
            <input
              type="text"
              className="w-full px-3  py-3 text-sm  border border-[#172D6D]  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 placeholder:text-sm"
             
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
              Meta keyword
            </label>
            <input
              type="text"
              className="w-full px-3  py-3 text-sm    border border-[#172D6D]  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 placeholder:text-sm"
    
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
              Meta description
            </label>
            <textarea
              rows={3}
              className="w-full px-3  py-3 text-sm   border border-[#172D6D]  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 placeholder:text-sm resize-none"
    
              readOnly
            />
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default PublishingMetadata 