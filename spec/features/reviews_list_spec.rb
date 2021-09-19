require "rails_helper"

# these were helpful 
# https://thoughtbot.com/blog/rspec-integration-tests-with-capybara
# https://www.codewithjason.com/rails-integration-tests-rspec-capybara/
# https://www.digitalocean.com/community/tutorials/build-a-restful-json-api-with-rails-5-part-one

RSpec.describe "User story", type: :feature do
  scenario "can create a new product" do
    visit root_path
    expect(page).to have_content("New product")

    click_on "New product"
    expect(current_path).to eq("/products/new")

    fill_in "Name", with: "The bad entrepreneur"
    click_on "Create Product"

    expect(current_path).to match(/\/products\/\d*/)
    expect(page).to have_content("Product was successfully created.")
  end

  scenario "can show product reviews when no reviews have been written" do
    product = Product.create(name: "The bad entrepreneur")

    visit products_path
    expect(page).to have_content("The bad entrepreneur")

    find("#product_#{product.id}").click_link("show reviews")
    expect(current_path).to match(/\/products\/\d*\/reviews/)
    expect(page).to have_content("No reviews yet")
    expect(page).to have_content("Add review")
  end

  scenario "can create a product review filling all fields in" do
    product = Product.create(name: "The bad entrepreneur")

    visit product_reviews_path(product)
    expect(page).to have_content("The bad entrepreneur")

    click_on "add-review-button"
    expect(page).to have_selector("#new-review")

    find(".star[data-value='4']").click
    fill_in "review_text", with: "just fluff"

    click_on "Submit review"
    expect(page).to have_content("just fluff")
  end

  scenario "can not create a product review without giving a rating and / or review text" do
    product = Product.create(name: "The bad entrepreneur")

    visit product_reviews_path(product)
    expect(page).to have_content("The bad entrepreneur")

    click_on "add-review-button"
    expect(page).to have_selector("#new-review")

    click_on "Submit review"
    expect(page).to have_content("2 errors prohibited this review from being saved:")

    find(".star[data-value='4']").click

    click_on "Submit review"
    expect(page).to have_content("1 error prohibited this review from being saved:")
  end
end

