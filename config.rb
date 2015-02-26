require "uglifier"

helpers do

end

set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'

set :haml, { :ugly => true, :format => :html5 }

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript, :compressor => ::Uglifier.new(define: { DEVMODE: false  })

  # Enable cache buster
  # activate :asset_hash

  # Use relative URLs
  # activate :relative_assets

  # Or use a different image path
  # set :http_prefix, "/Content/images/"
end

activate :s3_sync do |s3_sync|
  s3_sync.bucket  = 'live.watsonswander.com'
  s3_sync.region  = 'us-east-1'
  s3_sync.verbose = true
  s3_sync.delete  = false
end
