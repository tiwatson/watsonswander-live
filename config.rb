###
# Compass
###

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => {
#  :which_fake_page => "Rendering a fake page with a local variable" }

###
# Helpers
###

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
# configure :development do
#   activate :livereload
# end

require "uglifier"

helpers do

  def page_title
    title = "Wandering Labs"
    if data.page.title
      title << " | " + data.page.title
    end
    title
  end

  def page_description
    if data.page.desc
      description = data.page.desc
    else
      description = ""
    end
    description
  end

  def body_class
    if data.page.bodyclass
      bodyclass = data.page.bodyclass
    end
    bodyclass
  end
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
