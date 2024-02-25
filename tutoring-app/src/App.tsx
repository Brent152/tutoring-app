import QuizCard from './components/QuizCard'
import './index.css'


function App() {
  return (
    <div className='flex items-center justify-center h-screen>'>
      <div className='w-8/12 flex flex-col items-center h-screen gap-5'>
        <QuizCard
          question="What is the capital of France?"
          options={["Paris", "London", "Berlin", "Madrid"]}
        />
        <QuizCard
          question="What is the capital of France?"
          options={["Paris", "London", "Berlin", "Madrid"]}
        />
        <QuizCard
          question="What is the capital of France?"
          options={["Paris", "London", "Berlin", "Madrid"]}
        />
      </div>
    </div>
  )
}

export default App
