"use client";
import { useState, useEffect } from 'react';
import questionsData from '@/data/questions.json';

export default function QuizForm() {
  const [selectedChapter, setSelectedChapter] = useState('1');
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // Lấy danh sách chương và thực hành
  const chapters = Object.keys(questionsData.chapters).map((key) => ({
    key,
    title: questionsData.chapters[key].title,
  }));

  // Lấy câu hỏi cho chương/thực hành đã chọn
  const currentQuestions = questionsData.chapters[selectedChapter]?.questions || [];

  // Reset answers khi đổi chương
  useEffect(() => {
    setAnswers({});
    setResult(null);
  }, [selectedChapter]);

  // Xử lý chọn đáp án
  const handleAnswerChange = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Xử lý nộp bài
  const handleSubmit = (e) => {
    e.preventDefault();
    let score = 0;
    const detailedResults = currentQuestions.map((question) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) score++;
      return {
        userAnswer: userAnswer !== undefined ? question.options[userAnswer] : 'Chưa chọn',
        correctAnswer: question.options[question.correctAnswer],
        isCorrect,
        explanation: question.explanation,
      };
    });

    setResult({
      score,
      total: currentQuestions.length,
      details: detailedResults,
    });
  };

  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center text-black">
        Ôn Tập Quản Trị Mạng
      </h1>

      {/* Dropdown chọn chương/thực hành */}
      <div className="mb-4">
        <label
          htmlFor="chapter"
          className="block text-sm font-medium text-gray-900"
        >
          Chọn chương/thực hành:
        </label>
        <select
          id="chapter"
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
        >
          {chapters.map((chapter) => (
            <option key={chapter.key} value={chapter.key}>
              {chapter.title}
            </option>
          ))}
        </select>
      </div>

      {/* Form câu hỏi với kết quả hiển thị trực tiếp */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {currentQuestions.map((question, index) => (
          <div key={question.id} className="mb-6">
            <p className="font-medium text-black">
              Câu {index + 1}: {question.question}
            </p>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={optionIndex}
                    checked={answers[question.id] === optionIndex}
                    onChange={() => handleAnswerChange(question.id, optionIndex)}
                    className="form-radio"
                    disabled={result !== null}
                  />
                  <span className="ml-2 text-black">{option}</span>
                </label>
              </div>
            ))}
            {result && (
              <div
                className={`mt-2 p-2 rounded-md transition-opacity duration-500 ease-in-out ${
                  result.details[index].isCorrect ? 'bg-green-100' : 'bg-red-100'
                } ${result ? 'opacity-100' : 'opacity-0'}`}
              >
                {result.details[index].isCorrect ? (
                  <p className="text-green-600 font-semibold animate-slide-up">
                    Đáp án của bạn: {result.details[index].userAnswer} (Đúng)
                  </p>
                ) : (
                  <>
                    <p className="text-red-600 font-semibold animate-slide-up">
                      Đáp án của bạn: {result.details[index].userAnswer}
                    </p>
                    <p className="text-green-600 font-semibold animate-slide-up">
                      Đáp án đúng: {result.details[index].correctAnswer}
                    </p>
                    <p className="text-green-600 animate-slide-up">
                      Explanation: {result.details[index].explanation}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={result !== null}
        >
          {result ? 'Đã nộp' : 'Nộp bài'}
        </button>
        {result && (
          <p className="mt-4 text-center text-xl font-bold text-black animate-fade-in">
            Kết quả: {result.score}/{result.total} câu đúng
          </p>
        )}
      </form>
    </div>
  );
}