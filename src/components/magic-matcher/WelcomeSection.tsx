'use client';

import { IconSparkles, IconRocket, IconHeart, IconTarget, IconCirclesRelation } from '@tabler/icons-react';

export function WelcomeSection() {
  return (
    <div className="space-y-8">
      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-accent/10 border border-gray-700">
          <div className="card-body items-center text-center">
            <IconRocket className="w-8 h-8 text-foreground mb-2" />
            <h3 className="card-title text-lg">AI-Powered Search</h3>
            <p className="opacity-75 text-sm">
              AI canggih yang memahami konteks dan menemukan kandidat berdasarkan makna, bukan hanya kata kunci
            </p>
          </div>
        </div>

        <div className="card bg-accent/10 border border-gray-700">
          <div className="card-body items-center text-center">
            <IconCirclesRelation className="w-8 h-8 text-foreground mb-2" />
            <h3 className="card-title text-lg">Smart Matching</h3>
            <p className="opacity-75 text-sm">
              Interface swipe dengan penjelasan match yang dihasilkan AI untuk setiap kandidat
            </p>
          </div>
        </div>

        <div className="card bg-accent/10 border border-gray-700">
          <div className="card-body items-center text-center">
            <IconTarget className="w-8 h-8 text-foreground mb-2" />
            <h3 className="card-title text-lg">Precision Results</h3>
            <p className="opacity-75 text-sm">
              Dapatkan skor kesamaan dan penjelasan detail untuk setiap match untuk keputusan yang tepat
            </p>
          </div>
        </div>
      </div>

      {/* Demo section */}
      <div className="card bg-accent/10 border border-gray-700">
        <div className="card-body">
          <div className="text-center mb-6">
            <div className="badge badge-primary mb-2">Mulai Pencarian</div>
            <h2 className="text-2xl font-bold mb-2">Siap menemukan talenta sempurna?</h2>
            <p className="opacity-75">
              Mulai dengan mendeskripsikan kandidat ideal Anda di bawah. Sedetail atau seumum yang Anda inginkan!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-success/20 border border-success/30">
              <div className="card-body">
                <h3 className="card-title text-success text-base">✅ Contoh Bagus:</h3>
                <ul className="space-y-2 opacity-75 text-sm">
                  <li>"Senior React developer dengan 5+ tahun pengalaman"</li>
                  <li>"UI/UX designer kreatif yang suka mobile apps"</li>
                  <li>"Data scientist dengan keahlian Python dan ML"</li>
                  <li>"Marketing expert spesialis social media"</li>
                </ul>
              </div>
            </div>

            <div className="card bg-info/20 border border-info/30">
              <div className="card-body">
                <h3 className="card-title text-info text-base">💡 Tips Pro:</h3>
                <ul className="space-y-2 opacity-75 text-sm">
                  <li>• Sebutkan teknologi atau skill spesifik</li>
                  <li>• Sertakan level pengalaman (junior/senior)</li>
                  <li>• Tambahkan sifat kepribadian atau gaya kerja</li>
                  <li>• Sedetail yang Anda mau!</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-center flex-wrap mt-4">
            <div className="badge badge-outline">AWS Bedrock</div>
            <div className="badge badge-outline">Semantic Search</div>
            <div className="badge badge-outline">AI Matching</div>
            <div className="badge badge-outline">Smart Ranking</div>
          </div>
        </div>
      </div>
    </div>
  );
}
