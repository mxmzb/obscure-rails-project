class ProductChannel < ApplicationCable::Channel
  def subscribed
    stream_from "ProductChannel"
  end

  def unsubscribed
    # broadcast some message to the client to inform about
    # the connection closing, but i don't see a practical use 
    # for the current usecase
  end
end