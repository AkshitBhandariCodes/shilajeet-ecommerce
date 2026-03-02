'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionBlend from '@/components/SectionBlend';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart,
    Star,
    ArrowLeft,
    Check,
    Shield,
    Truck,
    Award,
    Heart,
    Share2,
    Plus,
    Minus,
    Flame
} from 'lucide-react';
import { getProductFireCoins } from '@/lib/fireCoins';
import ProductDetailsTabs from '@/components/ProductDetailsTabs';
import FrequentlyBoughtTogether from '@/components/FrequentlyBoughtTogether';
import WhyChoose from '@/components/WhyChoose';
import FAQSection from '@/components/FAQSection';
import InnovativeCarousel from '@/components/InnovativeCarousel';
import ProductImageSlider from '@/components/ProductImageSlider';
import CertificateOfAnalysis from '@/components/CertificateOfAnalysis';
import CustomerReviews from '@/components/CustomerReviews';

interface Review {
    _id: string;
    userId: string;
    userName: string;
    rating: number;
    title: string;
    comment: string;
    createdAt: string;
    verified: boolean;
}

// Product-specific FAQs
const getProductFAQs = (productId: string, product: any) => {
    // If product has FAQs in database, use those
    if (product.faqs && product.faqs.length > 0) {
        return product.faqs;
    }
    
    // Otherwise use hardcoded FAQs
    const faqMap: { [key: string]: any[] } = {
        'agnishila-trublk-gold-resin': [
            {
                question: 'What is TruBlk Agnishila Gold Resin?',
                answer: 'It is a premium & finest expression of Shilajit sourced from the untouched high-altitude Himalayan region enriched with Swarna Bhasma, KSM-66 Ashwagandha, Safed Musli, Kaunj, and Brahmi for superior energy, strength, stamina, and mental clarity.'
            },
            {
                question: 'What are the main health benefits?',
                answer: 'TruBlk Gold Resin supports: Strength & stamina, Energy & metabolism, Stress reduction, Mental clarity & focus, Testosterone & hormonal balance, Immunity & overall vitality.'
            },
            {
                question: 'How do I use it?',
                answer: 'Take 300–500 mg (pea-sized amount) daily. Mix with warm water, milk, or herbal tea and consume on an empty stomach.'
            },
            {
                question: 'How long until I see results?',
                answer: 'You may feel improved energy within 7–14 days. Full benefits appear after 4–8 weeks of consistent use.'
            },
            {
                question: 'Is it safe for daily use?',
                answer: 'Yes, it is safe for regular long-term use when taken in recommended dosage.'
            },
            {
                question: 'Who can take this product?',
                answer: 'Suitable for adults looking to improve energy, stamina, stress levels, and overall wellness. Not recommended for children, pregnant or breastfeeding women.'
            },
            {
                question: 'Is the product lab tested?',
                answer: 'Yes. Every batch is tested for purity, heavy metals, fulvic acid levels, and microbial safety. Made in GMP, HACCP & FDA-compliant facilities.'
            },
            {
                question: 'What makes it different from regular Shilajit?',
                answer: 'It is fortified with Swarna Bhasma, Ashwagandha, Musli, Kaunj, and Brahmi, making it more effective for vitality, hormonal balance, immunity, performance, and cognitive health.'
            },
            {
                question: 'Can it be taken with other supplements?',
                answer: 'Yes, it can be used alongside vitamins or protein supplements. Avoid combining with strong testosterone boosters without medical advice.'
            },
            {
                question: 'Does it need refrigeration?',
                answer: 'No. Store in a cool, dry place away from direct sunlight. Use a dry spoon.'
            },
            {
                question: 'Does the texture change with temperature?',
                answer: 'Yes. Shilajit may soften in heat and harden in cold, which is completely normal and does not affect quality.'
            },
            {
                question: 'Can women use it?',
                answer: 'Yes. It supports energy, stress balance, hormonal wellness, and immunity. Avoid use during pregnancy or breastfeeding.'
            },
            {
                question: 'Can I take it before workouts?',
                answer: 'Yes. It helps enhance strength, endurance, and recovery when taken 20–30 minutes before exercise.'
            },
            {
                question: 'What does it taste like?',
                answer: 'Shilajit has a natural earthy, resin-like taste. Mixing with warm milk or honey improves flavour.'
            },
            {
                question: 'How long does one jar last?',
                answer: 'Typically 40 days, depending on daily usage.'
            }
        ],
        'agnishila-shilajit-gummies': [
            {
                question: 'Why Choose Agnishila ShilaBoost Gummies?',
                answer: 'Agnishila ShilaBoost Gummies are crafted for those who want natural energy, stamina, and vitality in the easiest and tastiest form. Powered by pure Shilajit Resin, Gokhru, Ginger Extract, and Black Musli, they deliver maximum benefits with zero bitterness.'
            },
            {
                question: 'What makes ShilaBoost different from ordinary gummies?',
                answer: 'Unlike ordinary gummies that use low-quality extracts, ShilaBoost is made with authentic Shilajit Resin rich in fulvic minerals — giving you better stamina, strength, and recovery. It\'s real Shilajit, not just extract.'
            },
            {
                question: 'What Ayurvedic herbs are included?',
                answer: 'Our formulation combines Gokhru for strength and endurance, Black Musli for vitality and performance, and Ginger Extract for better digestion and absorption. This powerful blend makes ShilaBoost more effective than regular Shilajit supplements.'
            },
            {
                question: 'Are these gummies fast-absorbing and tasty?',
                answer: 'Yes! No bitter taste. No mixing. Each gummy is designed for quick absorption, delivering smooth, sustained energy throughout the day. They\'re delicious and convenient.'
            },
            {
                question: 'Who should take ShilaBoost Gummies?',
                answer: 'Perfect for professionals, athletes, gym-goers, or anyone who needs an all-day natural boost in energy, focus, and performance. Ideal for active lifestyles requiring daily stamina.'
            },
            {
                question: 'Are ShilaBoost Gummies lab tested and safe?',
                answer: 'Yes! Made in GMP & HACCP-certified facilities, each batch is tested for purity, safety, heavy metals, and quality. You get wellness you can trust — without compromise.'
            },
            {
                question: 'What is Agnishila\'s Promise?',
                answer: 'From sourcing to formulation, we ensure honest, high-quality, and effective wellness products backed by ancient Ayurveda and modern science. We promise purity and potency in every gummy.'
            }
        ],
        'ashwa-glo-gummies': [
            {
                question: 'What are Ashwa Glo Gummies?',
                answer: 'Ashwa Glo Gummies are calming wellness gummies powered by KSM-66 Ashwagandha, designed to reduce stress, improve sleep quality, balance mood, and support daily mental wellness.'
            },
            {
                question: 'How do these gummies help with stress?',
                answer: 'KSM-66 Ashwagandha is clinically studied to lower cortisol, promote relaxation, reduce anxiety, and support emotional balance.'
            },
            {
                question: 'Can Ashwa Glo Gummies improve sleep?',
                answer: 'Yes. They help you fall asleep faster, stay asleep longer, and wake up feeling refreshed—without causing drowsiness or dependency.'
            },
            {
                question: 'How many gummies should I take daily?',
                answer: 'Take 1–2 gummies daily, preferably in the evening or before bedtime.'
            },
            {
                question: 'Are these gummies habit-forming?',
                answer: 'No. Ashwa Glo Gummies are non-habit forming, safe for daily long-term use, and do not cause withdrawal or dependency.'
            },
            {
                question: 'When will I start noticing results?',
                answer: 'Many people feel calmer within 7–10 days. Full sleep and stress-relief benefits appear in 3–4 weeks of consistent use.'
            },
            {
                question: 'Can I take them during the day?',
                answer: 'Yes. You can take 1 gummy during the day for stress relief, and 1 gummy at night for sleep support.'
            },
            {
                question: 'Are Ashwa Glo Gummies safe?',
                answer: 'Yes. They are made with KSM-66 Ashwagandha, are lab-tested, and manufactured in GMP & HACCP-compliant facilities.'
            },
            {
                question: 'Can women use them?',
                answer: 'Yes. They are safe for both men and women looking for calmness, mood balance, and better sleep. Not recommended for pregnant or breastfeeding women.'
            },
            {
                question: 'Do they cause morning drowsiness?',
                answer: 'No. Unlike synthetic sleep aids, Ashwa Glo Gummies help you sleep naturally and wake up fresh—without grogginess.'
            },
            {
                question: 'Can I take them with other supplements?',
                answer: 'Yes, they can be taken with most vitamins, minerals, and daily supplements. Avoid combining with strong sedatives unless advised by a doctor.'
            },
            {
                question: 'Are they suitable for daily use?',
                answer: 'Absolutely. They are designed for safe, everyday stress and sleep support.'
            },
            {
                question: 'What do the gummies taste like?',
                answer: 'Ashwa Glo Gummies have a delicious fruity flavor, making it easy and enjoyable to take daily without bitterness.'
            },
            {
                question: 'How long does one bottle last?',
                answer: 'Depending on usage, one bottle lasts 30 days.'
            },
            {
                question: 'How should I store the gummies?',
                answer: 'Store in a cool, dry place, away from direct sunlight. Close the jar/tub tightly after every use.'
            }
        ],
        'agnishila-ashwagandha-gummies': [
            {
                question: 'What type of Ashwagandha is used in these gummies?',
                answer: 'We use KSM-66® Ashwagandha, the most clinically studied and premium full-spectrum root extract. Each gummy contains 300mg of KSM-66®, which is standardized to contain at least 5% withanolides for maximum efficacy.'
            },
            {
                question: 'How do these gummies help with stress and anxiety?',
                answer: 'KSM-66® Ashwagandha is an adaptogen that helps regulate cortisol levels (the stress hormone). Clinical studies show it reduces stress and anxiety by up to 44%, improves sleep quality, and enhances overall mood and mental well-being.'
            },
            {
                question: 'When is the best time to take Ashwagandha gummies?',
                answer: 'For stress relief and energy, take 2 gummies in the morning. For better sleep and relaxation, take them 30-60 minutes before bedtime. You can also split the dose - one in the morning and one at night for balanced benefits throughout the day.'
            },
            {
                question: 'Can I take these gummies with coffee or tea?',
                answer: 'Yes, you can take Ashwagandha gummies with coffee or tea. However, since Ashwagandha has calming properties, some people prefer taking it separately from caffeine to experience its full relaxing effects.'
            },
            {
                question: 'Are there any side effects?',
                answer: 'Ashwagandha is generally well-tolerated. Some people may experience mild digestive discomfort initially. Start with one gummy daily and gradually increase to two. Avoid if pregnant, nursing, or taking thyroid medication without consulting a doctor.'
            },
            {
                question: 'How long does it take to feel the effects?',
                answer: 'Some users feel calmer and more relaxed within a few days. However, for comprehensive benefits like improved sleep, reduced anxiety, and enhanced physical performance, consistent use for 4-8 weeks is recommended.'
            }
        ]
    };

    // Return product-specific FAQs or default FAQs
    return faqMap[productId] || [
        {
            question: `What makes ${product.name} special?`,
            answer: product.detailedDescription || 'This product is crafted with premium ingredients and backed by scientific research to deliver exceptional results.'
        },
        {
            question: 'How should I use this product?',
            answer: product.usage || 'Follow the recommended dosage on the packaging. For best results, use consistently as part of your daily wellness routine.'
        },
        {
            question: 'Is this product lab tested?',
            answer: `Yes, all our products are ${product.certifications?.join(', ') || 'FSSAI approved and lab tested'}. We ensure the highest quality standards.`
        },
        {
            question: 'What are the main ingredients?',
            answer: `This product contains: ${product.ingredients?.join(', ') || 'premium natural ingredients'}`
        },
        {
            question: 'How long will one package last?',
            answer: 'Depending on the recommended dosage, one package typically lasts 30-60 days with regular use.'
        }
    ];
};

// Product-specific usage instructions renderer
const renderUsageInstructions = (productId: string, product: any) => {
    if (productId === 'agnishila-trublk-gold-resin') {
        return (
            <div className="space-y-8">
                {/* Standard Usage */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider flex items-center space-x-2">
                        <Check className="w-6 h-6 text-primary-400" />
                        <span>Usage Instructions (Standard)</span>
                    </h3>
                    <div className="bg-black border border-white/10 p-6 mb-4">
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Take 300–500 mg (pea-sized amount) of TruBlk Shilajit Gold Resin once daily.
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-gray-300">
                            <li>Scoop a pea-sized amount using the provided spoon.</li>
                            <li>Mix it in warm water, milk, or herbal tea.</li>
                            <li>Stir well until fully dissolved.</li>
                            <li>Consume on an empty stomach in the morning for best results.</li>
                        </ol>
                    </div>
                </div>

                {/* Advanced Usage */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider flex items-center space-x-2">
                        <Check className="w-6 h-6 text-primary-400" />
                        <span>Advanced Usage Instructions (For Maximum Benefits)</span>
                    </h3>
                    <div className="bg-black border border-white/10 p-6">
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start space-x-3">
                                <span className="text-primary-400 font-bold">Morning:</span>
                                <span>300–500 mg with warm water or milk for energy & stamina.</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span className="text-primary-400 font-bold">Evening:</span>
                                <span>Optional second serving for stress relief & recovery (only if needed).</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span className="text-primary-400 font-bold">Athletes / Active adults:</span>
                                <span>Can take before workout for enhanced performance.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Important Notes */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider flex items-center space-x-2">
                        <span className="text-yellow-400">⚠</span>
                        <span>Important Notes</span>
                    </h3>
                    <div className="bg-black border border-yellow-400/20 p-6">
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start space-x-2">
                                <span className="text-yellow-400">•</span>
                                <span>Do not exceed 1 gram per day unless advised by a health professional.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-yellow-400">•</span>
                                <span>Not recommended for children, pregnant or lactating women.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-yellow-400">•</span>
                                <span>Keep the resin away from moisture & direct sunlight.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-yellow-400">•</span>
                                <span>Always use a dry spoon when scooping.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-yellow-400">•</span>
                                <span>Store in a cool, dry place.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Duration */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider flex items-center space-x-2">
                        <span className="text-primary-400">🧪</span>
                        <span>How long to use?</span>
                    </h3>
                    <div className="bg-black border border-white/10 p-6">
                        <p className="text-gray-300 leading-relaxed mb-2">
                            Take daily for 6–8 weeks for best results.
                        </p>
                        <p className="text-primary-400 font-bold">
                            Safe for long-term daily use.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    
    if (productId === 'agnishila-shilajit-gummies') {
        return (
            <div className="space-y-8">
                {/* How to Use */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider flex items-center space-x-2">
                        <span className="text-primary-400">🔸</span>
                        <span>How to Use</span>
                    </h3>
                    <div className="bg-black border border-white/10 p-6">
                        <p className="text-gray-300 leading-relaxed">
                            Take 2 gummies daily, preferably after breakfast or lunch.
                        </p>
                    </div>
                </div>

                {/* For Best Results */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider flex items-center space-x-2">
                        <span className="text-primary-400">🔸</span>
                        <span>For Best Results</span>
                    </h3>
                    <div className="bg-black border border-white/10 p-6">
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start space-x-2">
                                <span className="text-primary-400">•</span>
                                <span>Take consistently for 4–8 weeks.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-primary-400">•</span>
                                <span>Can be taken before workouts for an energy & stamina boost.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-primary-400">•</span>
                                <span>Stay hydrated for better absorption.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Do Not Exceed */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider flex items-center space-x-2">
                        <span className="text-primary-400">🔸</span>
                        <span>Do Not Exceed</span>
                    </h3>
                    <div className="bg-black border border-white/10 p-6">
                        <p className="text-gray-300 leading-relaxed">
                            Maximum 2 gummies per day, unless advised by a healthcare professional.
                        </p>
                    </div>
                </div>

                {/* Important Notes */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider flex items-center space-x-2">
                        <span className="text-yellow-400">⚠</span>
                        <span>Important Notes</span>
                    </h3>
                    <div className="bg-black border border-yellow-400/20 p-6">
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start space-x-2">
                                <span className="text-yellow-400">•</span>
                                <span>Suitable for adults only.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-yellow-400">•</span>
                                <span>Not recommended for pregnant or breastfeeding women.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-yellow-400">•</span>
                                <span>Keep out of reach of children.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-yellow-400">•</span>
                                <span>Store in a cool, dry place, away from direct sunlight.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-yellow-400">•</span>
                                <span>Close the pouch/jar tightly after use.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    if (productId === 'ashwa-glo-gummies') {
        return (
            <div className="space-y-8">
                {/* Daily Dosage */}
                {product.dailyDosage && (
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider flex items-center space-x-2">
                            <span className="text-primary-400">💊</span>
                            <span>Daily Dosage</span>
                        </h3>
                        <div className="bg-black border border-white/10 p-6">
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {product.dailyDosage}
                            </p>
                        </div>
                    </div>
                )}

                {/* For Best Results */}
                {product.forBestResults && product.forBestResults.length > 0 && (
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider flex items-center space-x-2">
                            <span className="text-primary-400">⭐</span>
                            <span>For Best Results</span>
                        </h3>
                        <div className="bg-black border border-white/10 p-6">
                            <ul className="space-y-3 text-gray-300">
                                {product.forBestResults.map((tip: string, index: number) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <Check className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Important Notes */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider flex items-center space-x-2">
                        <span className="text-yellow-400">⚠</span>
                        <span>Important Notes</span>
                    </h3>
                    <div className="bg-black border border-yellow-400/20 p-6">
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start space-x-2">
                                <span className="text-yellow-400">•</span>
                                <span>Suitable for adults only (men & women).</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-yellow-400">•</span>
                                <span>Not recommended for pregnant or breastfeeding women.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-yellow-400">•</span>
                                <span>Keep out of reach of children.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-yellow-400">•</span>
                                <span>Store in a cool, dry place, away from direct sunlight.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-yellow-400">•</span>
                                <span>Close the jar/tub tightly after every use.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
    
    // Default usage for other products
    return (
        <div>
            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Usage Instructions</h3>
            <div className="bg-black border border-white/10 p-6">
                <p className="text-gray-300 leading-relaxed">{product.usage || 'Follow the recommended dosage on the packaging.'}</p>
            </div>
        </div>
    );
};

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addItem } = useCart();
    const { user, isAuthenticated } = useAuth();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [bundleProducts, setBundleProducts] = useState<any[]>([]);
    const [currentReviewPage, setCurrentReviewPage] = useState(1);
    const reviewsPerPage = 5;
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        title: '',
        comment: ''
    });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${params.slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else {
                    console.error('Product not found');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) {
            fetchProduct();
        }
    }, [params.slug]);

    useEffect(() => {
        if (product) {
            fetchReviews();
            fetchBundleProducts();
        }
    }, [product]);

    const fetchBundleProducts = async () => {
        try {
            // Define bundle products based on current product
            let productIds: string[] = [];
            
            if (product.id === 'agnishila-trublk-gold-resin') {
                // For TruBlk Resin, show only AshwaGlow Gummies
                productIds = ['ashwa-glo-gummies'];
            } else if (product.id === 'ashwa-glo-gummies') {
                // For AshwaGlow Gummies, show only TruBlk Resin
                productIds = ['agnishila-trublk-gold-resin'];
            } else if (product.id === 'agnishila-shilajit-gummies') {
                // For Shilajit Gummies, show only AshwaGlow Gummies
                productIds = ['ashwa-glo-gummies'];
            }
            
            if (productIds.length > 0) {
                // Fetch all complementary products
                const bundleData = [];
                for (const productId of productIds) {
                    const response = await fetch(`/api/products/${productId}`);
                    const data = await response.json();
                    // Only show if not coming soon
                    if (data.status !== 'coming-soon') {
                        bundleData.push(data);
                    }
                }
                setBundleProducts(bundleData);
            } else {
                setBundleProducts([]);
            }
        } catch (error) {
            console.error('Error fetching bundle products:', error);
            setBundleProducts([]);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/reviews/${product?.id}`);
            if (response.ok) {
                const reviewsData = await response.json();
                setReviews(reviewsData);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoadingReviews(false);
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;

        setIsAdding(true);

        for (let i = 0; i < quantity; i++) {
            await addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
            });
        }

        setTimeout(() => {
            setIsAdding(false);
        }, 1000);
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated || !user) {
            alert('Please login to submit a review');
            return;
        }

        setSubmittingReview(true);

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: product?.id,
                    ...reviewForm,
                }),
            });

            if (response.ok) {
                setReviewForm({ rating: 5, title: '', comment: '' });
                setShowReviewForm(false);
                fetchReviews(); // Refresh reviews
            } else {
                alert('Failed to submit review. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleWishlistToggle = async () => {
        if (!product) return;

        setWishlistLoading(true);

        if (isInWishlist(product.id)) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
            });
        }

        setWishlistLoading(false);
    };

    const handleShare = async () => {
        if (!product) return;

        const shareData = {
            title: product.name,
            text: product.description,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(window.location.href);
                alert('Product link copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert('Product link copied to clipboard!');
            } catch (clipboardError) {
                console.error('Clipboard error:', clipboardError);
                alert('Unable to share. Please copy the URL manually.');
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-black">
                <Navbar />
                <div className="pt-32 pb-20 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
                </div>
                <Footer />
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-black">
                <Navbar />
                <div className="pt-32 pb-20 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">Product Not Found</h1>
                        <button
                            onClick={() => router.push('/products')}
                            className="bg-primary-400 text-black px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                        >
                            Back to Products
                        </button>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black relative">
            {/* Universal background */}
            <div className="fixed inset-0 z-0">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'url(https://res.cloudinary.com/dsejv31js/image/upload/v1767090389/agnishila/bg/vd.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed'
                    }}
                />
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <Navbar />

                <section className="pt-32 pb-20 bg-transparent relative overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-16 left-16 w-24 h-24 border-l-2 border-t-2 border-primary-400/20"></div>
                        <div className="absolute bottom-16 right-16 w-24 h-24 border-r-2 border-b-2 border-primary-400/20"></div>
                        <SectionBlend position="both" height="lg" intensity="medium" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        {/* Back Button */}
                        <button
                            onClick={() => router.push('/products')}
                            className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors mb-8"
                        >
                            <ArrowLeft size={20} />
                            <span className="text-sm uppercase tracking-wider">Back</span>
                        </button>

                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
                            {/* Product Image Slider */}
                            <div>
                                <ProductImageSlider 
                                    productId={product.id}
                                    productName={product.name}
                                    frontImage={product.image}
                                    images={product.images}
                                    isInWishlist={isInWishlist}
                                    onWishlistToggle={handleWishlistToggle}
                                    onShare={handleShare}
                                    wishlistLoading={wishlistLoading}
                                />
                            </div>

                            {/* Product Info */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                {/* Header */}
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4  tracking-wider">
                                        {product.name}
                                    </h1>

                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex space-x-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-5 h-5 fill-primary-400 text-primary-400" />
                                                ))}
                                            </div>
                                            <span className="text-white font-bold">{product.rating}</span>
                                            <span className="text-gray-400">({product.reviews} reviews)</span>
                                        </div>
                                    </div>

                                    <p className="text-xl text-gray-300 font-light leading-relaxed mb-6">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Price */}
                                <div className="bg-jet-900 border border-white/20 p-6">
                                    {product.status !== 'coming-soon' && (
                                        <>
                                            <div className="flex items-center space-x-4 mb-4">
                                                <span className="text-gray-500 text-xl line-through">₹{product.originalPrice}</span>
                                                <span className="text-4xl font-bold text-primary-400">₹{product.price}</span>
                                                <span className="bg-green-600/20 text-green-400 px-3 py-1 text-sm font-bold uppercase tracking-wider border border-green-600/30">
                                                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                                </span>
                                            </div>

                                            <div className="text-sm text-gray-400 mb-3">
                                                Inclusive of all taxes • Free shipping on all orders
                                            </div>

                                            {/* Fire Coins Badge */}
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                                className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 p-4 mt-4"
                                            >
                                                <div className="flex items-center justify-center space-x-2">
                                                    <span className="text-gray-300 text-sm">Earn</span>
                                                    <motion.div
                                                        animate={{ rotate: [0, 10, -10, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        <Flame className="w-5 h-5 text-orange-500" />
                                                    </motion.div>
                                                    <span className="text-2xl font-bold text-white">{getProductFireCoins(product.id)}</span>
                                                    <span className="text-gray-300 text-sm">Coins & redeem it on next purchase.</span>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Key Features</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {product.features.map((feature: string) => (
                                            <div key={feature} className="flex items-center space-x-2">
                                                <Check className="w-4 h-4 text-primary-400" />
                                                <span className="text-gray-300 text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity & Add to Cart */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-white font-bold uppercase tracking-wider">Quantity:</span>
                                        <div className="flex items-center space-x-2 bg-jet-900 border border-white/20">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={product.status === 'coming-soon'}
                                                className="p-2 text-white hover:text-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="text-white font-bold px-4 py-2 min-w-[3rem] text-center">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                disabled={product.status === 'coming-soon'}
                                                className="p-2 text-white hover:text-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isAdding || product.status === 'coming-soon'}
                                        className="w-full bg-primary-400 text-black py-4 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        <ShoppingCart size={18} />
                                        <span>{product.status === 'coming-soon' ? 'Coming Soon' : isAdding ? 'Adding to Cart...' : `Add ${quantity} to Cart`}</span>
                                    </button>
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                                    <div className="text-center">
                                        <Shield className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                                        <div className="text-xs text-gray-400 uppercase tracking-wider">Lab Tested</div>
                                    </div>
                                    <div className="text-center">
                                        <Truck className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                                        <div className="text-xs text-gray-400 uppercase tracking-wider">Free Shipping</div>
                                    </div>
                                    <div className="text-center">
                                        <Award className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                                        <div className="text-xs text-gray-400 uppercase tracking-wider">Certified</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Product Details Tabs */}
                        <div className="bg-jet-900 border border-white/20 relative overflow-hidden mb-16">
                            <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-b-[30px] border-b-primary-400/30"></div>

                            {/* Tab Navigation */}
                            <div className="flex border-b border-white/20">
                                {['description', 'ingredients', 'benefits', 'usage'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-8 py-4 font-bold uppercase tracking-wider text-sm transition-colors ${activeTab === tab
                                            ? 'text-primary-400 border-b-2 border-primary-400'
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-8">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'description' && (
                                        <motion.div
                                            key="description"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-8"
                                        >
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Product Description</h3>
                                                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{product.detailedDescription}</p>
                                            </div>

                                            {/* What It Does Section */}
                                            {product.whatItDoes && product.whatItDoes.length > 0 && (
                                                <div className="bg-black border border-white/10 p-6">
                                                    <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">What It Does</h4>
                                                    <ul className="space-y-2">
                                                        {product.whatItDoes.map((item: string, index: number) => (
                                                            <li key={index} className="flex items-start space-x-3">
                                                                <Check className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                                                                <span className="text-gray-300">{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Perfect For Section */}
                                            {product.perfectFor && product.perfectFor.length > 0 && (
                                                <div className="bg-black border border-white/10 p-6">
                                                    <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">Perfect For</h4>
                                                    <div className="grid md:grid-cols-2 gap-3">
                                                        {product.perfectFor.map((person: string, index: number) => (
                                                            <div key={index} className="flex items-center space-x-3">
                                                                <span className="text-primary-400">✔</span>
                                                                <span className="text-gray-300">{person}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Suitable For Section */}
                                            {product.suitableFor && (
                                                <div className="bg-black border border-white/10 p-6">
                                                    <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">Suitable For</h4>
                                                    <p className="text-gray-300 leading-relaxed">{product.suitableFor}</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {activeTab === 'ingredients' && (
                                        <motion.div
                                            key="ingredients"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Ingredients</h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {product.ingredients.map((ingredient: string, index: number) => (
                                                    <div key={index} className="flex items-center space-x-3 p-3 bg-black border border-white/10">
                                                        <Check className="w-5 h-5 text-primary-400" />
                                                        <span className="text-gray-300">{ingredient}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'benefits' && (
                                        <motion.div
                                            key="benefits"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Health Benefits</h3>
                                            
                                            {/* Check if product has keyHealthBenefits (rich format) */}
                                            {product.keyHealthBenefits && product.keyHealthBenefits.length > 0 ? (
                                                <div className="space-y-6">
                                                    {product.keyHealthBenefits.map((benefit: any, index: number) => (
                                                        <div key={index} className="bg-black border border-white/10 p-6">
                                                            <div className="flex items-start space-x-4">
                                                                <span className="text-3xl">{benefit.emoji}</span>
                                                                <div className="flex-1">
                                                                    <h4 className="text-xl font-bold text-white mb-2">{benefit.title}</h4>
                                                                    <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {product.benefits.map((benefit: string, index: number) => (
                                                        <div key={index} className="flex items-center space-x-3 p-3 bg-black border border-white/10">
                                                            <Star className="w-5 h-5 text-primary-400" />
                                                            <span className="text-gray-300">{benefit}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {activeTab === 'usage' && (
                                        <motion.div
                                            key="usage"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            {renderUsageInstructions(product.id, product)}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <InnovativeCarousel productName={product.name} productId={product.id} startIndex={3} />

                        {/* Customer Reviews Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-jet-900 border border-white/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>

                            <div className="p-8">
                                {/* Reviews Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider">Customer Reviews</h2>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex space-x-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className="w-5 h-5 fill-primary-400 text-primary-400" />
                                                    ))}
                                                </div>
                                                <span className="text-white font-bold text-lg">{product.rating}</span>
                                                <span className="text-gray-400">({product.reviews} reviews)</span>
                                            </div>
                                        </div>
                                    </div>
                                    {isAuthenticated && (
                                        <button
                                            onClick={() => setShowReviewForm(!showReviewForm)}
                                            className="bg-primary-400 text-black px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                                        >
                                            Write Review
                                        </button>
                                    )}
                                </div>

                                {/* Review Form */}
                                <AnimatePresence>
                                    {showReviewForm && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="bg-black border border-white/10 p-8 mb-8"
                                        >
                                            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Write Your Review</h3>
                                            <form onSubmit={handleReviewSubmit} className="space-y-6">
                                                <div>
                                                    <label className="block text-white font-bold mb-3 uppercase tracking-wider">Rating</label>
                                                    <div className="flex space-x-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                                className={`w-10 h-10 transition-colors ${star <= reviewForm.rating ? 'text-primary-400' : 'text-gray-600 hover:text-gray-400'
                                                                    }`}
                                                            >
                                                                <Star className="w-full h-full fill-current" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-white font-bold mb-3 uppercase tracking-wider">Review Title</label>
                                                    <input
                                                        type="text"
                                                        value={reviewForm.title}
                                                        onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                                                        className="w-full bg-jet-900 border border-white/20 text-white px-4 py-4 focus:border-primary-400 focus:outline-none transition-colors"
                                                        placeholder="Give your review a title"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-white font-bold mb-3 uppercase tracking-wider">Your Review</label>
                                                    <textarea
                                                        value={reviewForm.comment}
                                                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                                        rows={6}
                                                        className="w-full bg-jet-900 border border-white/20 text-white px-4 py-4 focus:border-primary-400 focus:outline-none transition-colors resize-none"
                                                        placeholder="Share your experience with this product. What did you like? How did it help you?"
                                                        required
                                                    />
                                                </div>

                                                <div className="flex space-x-4">
                                                    <button
                                                        type="submit"
                                                        disabled={submittingReview}
                                                        className="bg-primary-400 text-black px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowReviewForm(false)}
                                                        className="border border-white/20 text-white px-8 py-4 font-bold uppercase tracking-wider text-sm hover:border-primary-400 hover:text-primary-400 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Reviews List */}
                                {loadingReviews ? (
                                    <div className="flex items-center justify-center py-16">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
                                    </div>
                                ) : reviews.length === 0 ? (
                                    <div className="text-center py-16">
                                        <Star className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                                        <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">No Reviews Yet</h3>
                                        <p className="text-gray-400 text-lg">Be the first to review this product and help others make informed decisions</p>
                                        {!isAuthenticated && (
                                            <p className="text-gray-500 text-sm mt-4">Please log in to write a review</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between border-b border-white/20 pb-4">
                                            <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                                                {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
                                            </h3>
                                        </div>

                                        {/* Calculate pagination */}
                                        {(() => {
                                            const totalPages = Math.ceil(reviews.length / reviewsPerPage);
                                            const startIndex = (currentReviewPage - 1) * reviewsPerPage;
                                            const endIndex = startIndex + reviewsPerPage;
                                            const paginatedReviews = reviews.slice(startIndex, endIndex);

                                            return (
                                                <>
                                                    {/* Reviews List */}
                                                    <div className="space-y-8">
                                                        {paginatedReviews.map((review) => (
                                                            <motion.div
                                                                key={review._id}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="bg-black border border-white/10 p-8"
                                                            >
                                                                <div className="flex items-start justify-between mb-6">
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className="w-12 h-12 bg-primary-400 flex items-center justify-center">
                                                                            <span className="text-black font-bold text-lg">
                                                                                {review.userName.charAt(0).toUpperCase()}
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-white font-bold text-lg">{review.userName}</div>
                                                                            <div className="text-gray-400">{formatDate(review.createdAt)}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="flex space-x-1">
                                                                            {[...Array(5)].map((_, i) => (
                                                                                <Star
                                                                                    key={i}
                                                                                    className={`w-5 h-5 ${i < review.rating ? 'text-primary-400 fill-current' : 'text-gray-600'
                                                                                        }`}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                        {review.verified && (
                                                                            <span className="bg-green-600/20 text-green-400 px-3 py-1 text-xs font-bold uppercase tracking-wider border border-green-600/30">
                                                                                Verified Purchase
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <h4 className="text-white font-bold text-xl mb-3">{review.title}</h4>
                                                                <p className="text-gray-300 leading-relaxed text-lg">{review.comment}</p>
                                                            </motion.div>
                                                        ))}
                                                    </div>

                                                    {/* Pagination Controls */}
                                                    {totalPages > 1 && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-white/20"
                                                        >
                                                            {/* Previous Button */}
                                                            <button
                                                                onClick={() => setCurrentReviewPage(prev => Math.max(prev - 1, 1))}
                                                                disabled={currentReviewPage === 1}
                                                                className="px-4 py-2 bg-jet-800 hover:bg-jet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors font-semibold uppercase tracking-wider text-sm"
                                                            >
                                                                ← Previous
                                                            </button>

                                                            {/* Page Numbers */}
                                                            <div className="flex gap-1">
                                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                                    <button
                                                                        key={page}
                                                                        onClick={() => setCurrentReviewPage(page)}
                                                                        className={`w-10 h-10 rounded transition-colors font-bold uppercase tracking-wider text-sm ${
                                                                            currentReviewPage === page
                                                                                ? 'bg-primary-400 text-black'
                                                                                : 'bg-jet-800 hover:bg-jet-700 text-white'
                                                                        }`}
                                                                    >
                                                                        {page}
                                                                    </button>
                                                                ))}
                                                            </div>

                                                            {/* Next Button */}
                                                            <button
                                                                onClick={() => setCurrentReviewPage(prev => Math.min(prev + 1, totalPages))}
                                                                disabled={currentReviewPage === totalPages}
                                                                className="px-4 py-2 bg-jet-800 hover:bg-jet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors font-semibold uppercase tracking-wider text-sm"
                                                            >
                                                                Next →
                                                            </button>

                                                            {/* Page Info */}
                                                            <div className="ml-4 text-gray-400 text-sm">
                                                                Page {currentReviewPage} of {totalPages}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Frequently Bought Together */}
                {bundleProducts.length > 0 && (
                    <FrequentlyBoughtTogether
                        mainProduct={{
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            originalPrice: product.originalPrice,
                            image: product.image
                        }}
                        bundleProducts={bundleProducts.map(p => ({
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            originalPrice: p.originalPrice,
                            image: p.image
                        }))}
                    />
                )}

                {/* Why Choose Section */}
               

                {/* Certificate of Analysis Section */}
                <CertificateOfAnalysis />

                {/* Premium Validation Section */}
                <CustomerReviews />

                {/* FAQ Section */}
                <FAQSection 
                    title="Frequently Asked Questions"
                    faqs={getProductFAQs(product.id, product)}
                />

                <Footer />
            </div>
        </main>
    );
}