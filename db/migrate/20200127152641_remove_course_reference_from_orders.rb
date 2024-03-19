class RemoveCourseReferenceFromOrders < ActiveRecord::Migration[6.0]
  def change
    Order.all.each do |order|
      if order.course_id
        course = Curriculum::Course.find(order.course_id)
        order.courses << course
      end
    end
    remove_reference :orders, :course, index: true
  end
end
