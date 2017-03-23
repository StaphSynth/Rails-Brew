require 'test_helper'

class MaltsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @malt = malts(:one)
  end

  test "should get index" do
    get malts_url
    assert_response :success
  end

  test "should get new" do
    get new_malt_url
    assert_response :success
  end

  test "should create malt" do
    assert_difference('Malt.count') do
      post malts_url, params: { malt: { EBC: @malt.EBC, GPK: @malt.GPK, description: @malt.description, name: @malt.name, type: @malt.type, use: @malt.use } }
    end

    assert_redirected_to malt_url(Malt.last)
  end

  test "should show malt" do
    get malt_url(@malt)
    assert_response :success
  end

  test "should get edit" do
    get edit_malt_url(@malt)
    assert_response :success
  end

  test "should update malt" do
    patch malt_url(@malt), params: { malt: { EBC: @malt.EBC, GPK: @malt.GPK, description: @malt.description, name: @malt.name, type: @malt.type, use: @malt.use } }
    assert_redirected_to malt_url(@malt)
  end

  test "should destroy malt" do
    assert_difference('Malt.count', -1) do
      delete malt_url(@malt)
    end

    assert_redirected_to malts_url
  end
end
