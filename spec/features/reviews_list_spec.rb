require 'rails_helper'

RSpec.describe 'Visitor visits reviews', type: :feature do
  scenario 'for first time' do
    visit root_path

    expect(page).to have_content('book was full of fluff')
  end
end