require 'test_helper'

class YeastsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @yeast = yeasts(:one)
  end

  test "should get index" do
    get yeasts_url
    assert_response :success
  end

  test "should get new" do
    get new_yeast_url
    assert_response :success
  end

  test "should create yeast" do
    assert_difference('Yeast.count') do
      post yeasts_url, params: { yeast: { description: @yeast.description, name: @yeast.name, temp_range: @yeast.temp_range, type: @yeast.type } }
    end

    assert_redirected_to yeast_url(Yeast.last)
  end

  test "should show yeast" do
    get yeast_url(@yeast)
    assert_response :success
  end

  test "should get edit" do
    get edit_yeast_url(@yeast)
    assert_response :success
  end

  test "should update yeast" do
    patch yeast_url(@yeast), params: { yeast: { description: @yeast.description, name: @yeast.name, temp_range: @yeast.temp_range, type: @yeast.type } }
    assert_redirected_to yeast_url(@yeast)
  end

  test "should destroy yeast" do
    assert_difference('Yeast.count', -1) do
      delete yeast_url(@yeast)
    end

    assert_redirected_to yeasts_url
  end
end
