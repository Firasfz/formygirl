'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Heart, Sparkles, Mail, Star, Clock, MapPin, Music, ChevronDown, Camera, Upload, X } from 'lucide-react'
import Image from 'next/image'

// Floating Heart Component
function FloatingHeart({ delay, duration, left, size }: { delay: number; duration: number; left: number; size: number }) {
  return (
    <div
      className="floating-heart fixed pointer-events-none z-0"
      style={{
        left: `${left}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        fontSize: `${size}px`,
      }}
    >
      <Heart
        className="text-purple-400/40 fill-purple-400/30"
        style={{ width: size, height: size }}
      />
    </div>
  )
}

// Sparkle Component
function Sparkle({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute pointer-events-none animate-pulse"
      style={{ left: x, top: y }}
    >
      <Sparkles className="w-4 h-4 text-purple-400" />
    </div>
  )
}

// Love Letter Modal
function LoveLetterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl transform animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
            <Mail className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">A Letter For You</h3>
        </div>
        <div className="prose prose-purple max-w-none">
          <p className="text-gray-700 leading-relaxed italic">
            &ldquo;My Dearest Love,
          </p>
          <p className="text-gray-700 leading-relaxed">
            From the moment you walked into my life, everything changed. 
            You brought colors to my gray world, laughter to my quiet days, 
            and a love I never knew was possible.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Every day with you feels like a beautiful adventure. 
            Your smile is my favorite sight, your voice is my favorite sound, 
            and your love is my greatest treasure.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Thank you for being you, for loving me, and for making every moment magical.
          </p>
          <p className="text-gray-700 leading-relaxed font-semibold mt-4">
            Forever Yours,<br/>
            With All My Love &hearts;
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-violet-600 transition-all duration-300 transform hover:scale-[1.02]"
        >
          Close With Love
        </button>
      </div>
    </div>
  )
}

// Photo Upload Modal
function PhotoUploadModal({ 
  isOpen, 
  onClose, 
  onUpload 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onUpload: (imageUrl: string) => void;
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleConfirm = useCallback(() => {
    if (previewUrl) {
      onUpload(previewUrl)
      onClose()
      setPreviewUrl(null)
    }
  }, [previewUrl, onUpload, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
            <Camera className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Add Your Photo</h3>
          <p className="text-gray-500 mt-2">Upload a special memory together</p>
        </div>

        {!previewUrl ? (
          <div
            className={`photo-upload-area rounded-2xl p-8 text-center cursor-pointer ${
              isDragging ? 'dragging' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">Drag & drop your photo here</p>
            <p className="text-gray-400 text-sm">or click to browse</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        ) : (
          <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!previewUrl}
            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-violet-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Photo
          </button>
        </div>
      </div>
    </div>
  )
}

// Reason Card Component
function ReasonCard({ number, text, delay }: { number: number; text: string; delay: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={cardRef}
      className={`transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-purple-100">
        <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
          {number}
        </div>
        <div className="flex items-start gap-4 pt-2">
          <Heart className="w-6 h-6 text-purple-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <p className="text-gray-700 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  )
}

// Memory Card Component
function MemoryCard({ image, title, description }: { image: string; title: string; description: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      <div className="aspect-square relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h4 className="text-lg font-bold mb-1">{title}</h4>
          <p className="text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{description}</p>
        </div>
      </div>
    </div>
  )
}

// Couple Photo Card Component
function CouplePhotoCard({ 
  imageUrl, 
  onAddPhoto 
}: { 
  imageUrl: string | null;
  onAddPhoto: () => void;
}) {
  return (
    <div 
      className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
      onClick={onAddPhoto}
    >
      {imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt="Us together"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h4 className="text-lg font-bold mb-1">Us Together</h4>
            <p className="text-sm text-white/80">Our favorite moment</p>
          </div>
          <div className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-violet-100 flex flex-col items-center justify-center p-6 border-2 border-dashed border-purple-300 hover:border-purple-400 transition-colors">
          <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Camera className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-purple-600 font-medium text-center">Add Your Photo</p>
          <p className="text-purple-400 text-sm text-center mt-1">Click to upload</p>
        </div>
      )}
    </div>
  )
}

export default function ValentinePage() {
  const [showLetter, setShowLetter] = useState(false)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [couplePhoto, setCouplePhoto] = useState<string | null>(null)
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [showSparkles, setShowSparkles] = useState<{ x: number; y: number }[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Valentine's date (you can customize this)
  const valentineDate = new Date('2025-02-14T00:00:00')

  useEffect(() => {
    setIsLoaded(true)
    const timer = setInterval(() => {
      const now = new Date()
      const diff = valentineDate.getTime() - now.getTime()
      
      if (diff > 0) {
        setTime({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Create floating hearts
  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 8,
    left: Math.random() * 100,
    size: 16 + Math.random() * 24,
  }))

  const reasons = [
    "Your beautiful smile that lights up my entire world",
    "The way you laugh at my silly jokes",
    "Your kindness that touches everyone around you",
    "How you make ordinary moments feel extraordinary",
    "Your unwavering support and belief in me",
    "The warmth of your hugs that feels like home",
    "Your adorable quirks that make you uniquely you",
    "How you understand me without words",
    "The adventures we share together",
    "Simply being the most amazing person I know",
  ]

  const handleHeartClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const newSparkle = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    setShowSparkles(prev => [...prev, newSparkle])
    setTimeout(() => {
      setShowSparkles(prev => prev.slice(1))
    }, 1000)
  }

  const handlePhotoUpload = useCallback((imageUrl: string) => {
    setCouplePhoto(imageUrl)
  }, [])

  return (
    <div className="min-h-screen love-gradient overflow-x-hidden">
      {/* Floating Hearts Background */}
      {hearts.map((heart) => (
        <FloatingHeart key={heart.id} {...heart} />
      ))}

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Hero Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/romantic-hero.png"
            alt="Romantic couple"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/80" />
        </div>

        <div className={`relative z-10 text-center max-w-4xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Animated Heart */}
          <div 
            className="relative inline-block mb-8 cursor-pointer"
            onClick={handleHeartClick}
          >
            <Heart className="w-24 h-24 text-purple-500 fill-purple-400 pulse-heart heart-glow" />
            {showSparkles.map((sparkle, i) => (
              <Sparkle key={i} x={sparkle.x} y={sparkle.y} />
            ))}
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="shimmer-text">Happy Valentine&apos;s Day</span>
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-700 mb-6">
            My Dearest Love
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Every moment with you is a treasure, every memory a gift. 
            You are my forever Valentine.
          </p>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-4 md:gap-8 mb-12">
            {[
              { value: time.days, label: 'Days' },
              { value: time.hours, label: 'Hours' },
              { value: time.minutes, label: 'Minutes' },
              { value: time.seconds, label: 'Seconds' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center mb-2 border border-purple-100">
                  <span className="text-2xl md:text-4xl font-bold text-purple-500">{item.value}</span>
                </div>
                <span className="text-xs md:text-sm text-gray-500 uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setShowLetter(true)}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Open Your Love Letter
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-purple-400" />
        </div>
      </section>

      {/* Photo Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Heart className="w-12 h-12 text-purple-400 mx-auto mb-4 pulse-heart fill-purple-300" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Beautiful Moments</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Every snapshot captures a piece of our beautiful journey together
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {/* Couple Photo - Clickable to add photo */}
            <CouplePhotoCard 
              imageUrl={couplePhoto} 
              onAddPhoto={() => setShowPhotoUpload(true)} 
            />
            
            <MemoryCard
              image="/roses.png"
              title="Our Love"
              description="Like flowers, our love blooms eternally"
            />
            <MemoryCard
              image="/hearts.png"
              title="Forever"
              description="My heart belongs to you always"
            />
          </div>
        </div>
      </section>

      {/* Reasons Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Star className="w-12 h-12 text-purple-400 mx-auto mb-4 fill-purple-300" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Reasons I Love You
            </h2>
            <p className="text-gray-600">Just a few of the countless reasons...</p>
          </div>

          <div className="grid gap-4 md:gap-6">
            {reasons.map((reason, index) => (
              <ReasonCard
                key={index}
                number={index + 1}
                text={reason}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-500 to-violet-500 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
            <Heart className="w-16 h-16 mx-auto mb-6 fill-white/30" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">My Promise To You</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="space-y-2">
                <Clock className="w-8 h-8 mx-auto" />
                <h3 className="font-semibold text-lg">Always There</h3>
                <p className="text-white/80 text-sm">Through every moment, big or small</p>
              </div>
              <div className="space-y-2">
                <MapPin className="w-8 h-8 mx-auto" />
                <h3 className="font-semibold text-lg">By Your Side</h3>
                <p className="text-white/80 text-sm">Wherever life takes us together</p>
              </div>
              <div className="space-y-2">
                <Music className="w-8 h-8 mx-auto" />
                <h3 className="font-semibold text-lg">Forever Yours</h3>
                <p className="text-white/80 text-sm">My heart beats only for you</p>
              </div>
            </div>
            <p className="text-xl italic text-white/90">
              &ldquo;I promise to love you, cherish you, and make you smile every single day of our lives together.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 text-center bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <Heart className="w-12 h-12 text-purple-400 mx-auto mb-4 pulse-heart fill-purple-300" />
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            I Love You
          </h3>
          <p className="text-gray-600 mb-6">
            Today, Tomorrow, and Forever
          </p>
          <div className="flex justify-center gap-2 text-3xl">
            {['💜', '💖', '💜', '💗', '💜'].map((emoji, i) => (
              <span 
                key={i} 
                className="inline-block float-animation"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>
          <p className="mt-8 text-sm text-gray-400">
            Made with love, just for you
          </p>
        </div>
      </footer>

      {/* Love Letter Modal */}
      <LoveLetterModal isOpen={showLetter} onClose={() => setShowLetter(false)} />
      
      {/* Photo Upload Modal */}
      <PhotoUploadModal 
        isOpen={showPhotoUpload} 
        onClose={() => setShowPhotoUpload(false)}
        onUpload={handlePhotoUpload}
      />
    </div>
  )
}
