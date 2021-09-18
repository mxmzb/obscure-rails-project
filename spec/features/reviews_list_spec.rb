require "rails_helper"

RSpec.describe "User story", type: :feature do
  it "can create a new product" do
    visit root_path
    expect(page).to have_content("New product")

    click_on "New product"
    expect(current_path).to eq("/products/new")

    fill_in "Name", with: "The bad entrepreneur"
    click_on "Create Product"

    expect(current_path).to match(/\/products\/\d*/)
    expect(page).to have_content("Product was successfully created.")
  end

  it "can show product reviews when no reviews have been written" do
    product = Product.create(name: "The bad entrepreneur")

    visit products_path
    expect(page).to have_content("The bad entrepreneur")

    find("#product_#{product.id}").click_link("show reviews")
    expect(current_path).to match(/\/products\/\d*\/reviews/)
    expect(page).to have_content("No reviews yet")
    expect(page).to have_content("Add review")
  end

  it "can create a product review" do
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
end

