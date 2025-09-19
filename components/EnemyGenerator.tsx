import React, { useState, useCallback } from 'react';
import { generatePixelArtEnemy } from '../services/geminiService';

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-violet-500"></div>
        <p className="mt-4 text-lg font-bold text-gray-600">生成中...</p>
    </div>
);

const EnemyGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generatePixelArtEnemy(prompt);
      setGeneratedImage(imageUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto">
      <p className="text-center mb-5 text-gray-600">
        ゲームに登場させたい敵キャラクターの説明を入力してください。AIがポップなイラストを生成します！
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="例：怒っているキノコ、パーティ帽子をかぶったスライム"
          className="flex-grow p-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-400 transition-shadow"
          disabled={isLoading}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-full hover:from-pink-600 hover:to-orange-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg transform hover:scale-105"
        >
          {isLoading ? '生成中...' : '生成！'}
        </button>
      </div>

      <div className="mt-8 flex justify-center items-center h-80 bg-gray-100 rounded-xl">
        {isLoading && <LoadingSpinner />}
        {error && <p className="text-red-500 font-bold p-4 text-center">{error}</p>}
        {generatedImage && (
          <div className="p-4">
            <img src={generatedImage} alt="Generated Enemy" className="max-w-full max-h-72 object-contain" />
          </div>
        )}
        {!isLoading && !error && !generatedImage && (
            <div className="text-center text-gray-500">
                <p className="text-6xl">🖼️</p>
                <p>ここに画像が生成されます</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default EnemyGenerator;