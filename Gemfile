source 'https://rubygems.org'

git_source(:github) { |repo_name| "https://github.com/#{repo_name}" }

group :development do
  gem 'guard'
  gem 'guard-rspec'
  gem 'solargraph'
end

group :development, :test do
  gem 'bundler', '~> 1.17'
  gem 'rake', '~> 10.0'
  gem 'rspec', '~> 3.0'
  gem 'simplecov', require: false
end
