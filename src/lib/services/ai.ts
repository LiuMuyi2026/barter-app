export type KycResult = {
  status: 'VERIFIED' | 'REJECTED';
  confidence: number;
  reason?: string;
};

export type ItemAnalysisResult = {
  category: string;
  brand: string;
  model: string;
  condition: 'BRAND_NEW' | 'LIKE_NEW' | 'USED_GOOD' | 'USED_FAIR'; // Matching Prisma Enum
  tags: string[];
};

export type ValuationResult = {
  estimatedValue: number;
  currency: string;
  confidence: number;
  priceRange: { min: number; max: number };
  reasoning: string;
};

export class AiService {
  /**
   * Simulates ID Verification (KYC)
   * Returns VERIFIED after a short delay.
   */
  static async performKYC(file: File): Promise<KycResult> {
    console.log(`[AI-Mock] Analyzing ID: ${file.name}`);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate 2s processing time

    return {
      status: 'VERIFIED',
      confidence: 0.98,
    };
  }

  /**
   * Simulates Computer Vision for Item Analysis
   */
  static async analyzeItemImage(file: File): Promise<ItemAnalysisResult> {
    console.log(`[AI-Mock] Analyzing Item Image: ${file.name}`);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock logic based on filename for demo purposes
    const name = file.name.toLowerCase();
    
    if (name.includes('iphone')) {
      return {
        category: 'Smartphone',
        brand: 'Apple',
        model: 'iPhone 13 Pro',
        condition: 'USED_GOOD',
        tags: ['#smartphone', '#apple', '#iphone13'],
      };
    } else if (name.includes('watch')) {
       return {
        category: 'Watches',
        brand: 'Rolex',
        model: 'Submariner',
        condition: 'LIKE_NEW',
        tags: ['#luxury', '#watch', '#rolex'],
      };
    }

    // Default Fallback
    return {
      category: 'Electronics',
      brand: 'Generic',
      model: 'Unknown Model',
      condition: 'USED_GOOD',
      tags: ['#gadget', '#electronics'],
    };
  }

  /**
   * Simulates Valuation
   */
  static async estimateValue(analysis: ItemAnalysisResult): Promise<ValuationResult> {
     await new Promise((resolve) => setTimeout(resolve, 1000));
     
     if (analysis.brand === 'Apple') {
        return {
            estimatedValue: 650,
            currency: 'USD',
            confidence: 0.92,
            priceRange: { min: 600, max: 700 },
            reasoning: 'Based on recent sales of iPhone 13 Pro in Good condition.',
        };
     }
     
     return {
        estimatedValue: 100,
        currency: 'USD',
        confidence: 0.60,
        priceRange: { min: 80, max: 120 },
        reasoning: 'Generic estimate for electronics.',
     };
  }
}
