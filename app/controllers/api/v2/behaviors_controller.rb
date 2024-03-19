class Api::V2::BehaviorsController < ApiController
    def create
        @id = params[:behavior_id]
        behavior = Curriculum::Behavior.find(@id)
        render json: {behavior_maps: behavior.behavior_maps, examples: behavior.examples, questions: behavior.questions, exercises: behavior.exercises}, status: :ok
    end

    def get_behaviors
        behavior = Curriculum::Behavior.all
        render json: behavior, status: :ok
    end


    def get_behavior
        behavior = Curriculum::Behavior.find(params[:behaviorId])
        render json: behavior.as_json(include: [:questions, :exercises, :examples, :behavior_maps, :help_to_habits]), status: :ok
    end
end