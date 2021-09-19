require 'rails_helper'

RSpec.describe "products/index", type: :view do
  before(:each) do
    assign(:products, [
      Product.create!(
        name: "Foo"
      ),
      Product.create!(
        name: "Foo"
      )
    ])
  end

  it "renders a list of products" do
    render
    assert_select ".scaffold_record", text: /Foo/, count: 2
  end
end
