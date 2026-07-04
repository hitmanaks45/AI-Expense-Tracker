import GoalPlannerForm from "../components/GoalPlannerForm";

const GoalPlanner = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Goal Planner
        </h1>

        <p className="text-gray-500 mt-2">
          Plan your financial goals with AI-powered recommendations.
        </p>
      </div>

      <GoalPlannerForm />
    </div>
  );
};

export default GoalPlanner;