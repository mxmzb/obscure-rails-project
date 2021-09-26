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
    fill_in "text", with: "just fluff"

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

  scenario "after creating an nth review the average rating is showing the correct values" do
    product = Product.create(name: "The bad entrepreneur")
    review = Review.create(rating: 4, text: "fluff", product: product)

    visit product_reviews_path(product)
    expect(find("#average-rating")).to have_content("4.0")
    expect(find("#average-rating")).to have_selector(".star.active", count: 4)

    # let's check the active stars are rounded up to 3 if the average is 2.5
    review = Review.create(rating: 1, text: "more fluff", product: product)
    # reload page because we added just in db and don't have a websocket in place to update
    visit current_path
    expect(find("#average-rating")).to have_content("2.5")
    expect(find("#average-rating")).to have_selector(".star.active", count: 3)

    # let's check the active stars are rounded down to 2 if the average is 2.33
    review = Review.create(rating: 2, text: "even more fluff", product: product)
    visit current_path
    expect(find("#average-rating")).to have_content("2.3")
    expect(find("#average-rating")).to have_selector(".star.active", count: 2)
  end

  scenario "after creating a 2nd review through the form the average rating adjusts without reload" do
    product = Product.create(name: "The bad entrepreneur")
    review = Review.create(rating: 4, text: "fluff", product: product)

    visit product_reviews_path(product)

    click_on "add-review-button"
    expect(page).to have_selector("#new-review")

    find(".star[data-value='1']").click
    fill_in "text", with: "just fluff"

    click_on "Submit review"
    expect(find("#average-rating")).to have_content("2.5")
    expect(find("#average-rating")).to have_selector(".star.active", count: 3)
  end


  scenario "retrieves live updates" do
    product = Product.create(name: "The bad entrepreneur")
    review = Review.create(rating: 4, text: "fluff", product: product)

    visit product_reviews_path(product)

    expect(find("#average-rating")).to have_content("4.0")
    expect(find("#average-rating")).to have_selector(".star.active", count: 4)
    expect(page).to have_selector(".review", count: 1)

    Capybara.using_session("2nd session") do
      visit product_reviews_path(product)

      expect(find("#average-rating")).to have_content("4.0")
      expect(find("#average-rating")).to have_selector(".star.active", count: 4)
      expect(page).to have_selector(".review", count: 1)

      click_on "add-review-button"
      expect(page).to have_selector("#new-review")

      find(".star[data-value='1']").click
      fill_in "text", with: "just fluff"

      click_on "Submit review"
      expect(find("#average-rating")).to have_content("2.5")
      expect(find("#average-rating")).to have_selector(".star.active", count: 3)
      expect(page).to have_selector(".review", count: 2)
    end
    
    expect(find("#average-rating")).to have_content("2.5")
    expect(find("#average-rating")).to have_selector(".star.active", count: 3)
    expect(page).to have_selector(".review", count: 2)
  end
end

