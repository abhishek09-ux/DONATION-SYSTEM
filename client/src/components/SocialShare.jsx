import { useState } from 'react';
import { FiShare2, FiTwitter, FiFacebook, FiLinkedin, FiCopy, FiCheck, FiMail, FiMessageCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SocialShare = ({ 
  donation,
  charity,
  url = window.location.href,
  compact = false,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareText = donation 
    ? `I just donated ₹${donation.amount?.toLocaleString()} to ${charity?.organizationName || 'a great cause'} through DonateMatch! Join me in making a difference. 🙏❤️`
    : `Check out ${charity?.organizationName} on DonateMatch - a verified charity making real impact! 🌟`;

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: FiTwitter,
      color: 'bg-[#1DA1F2] hover:bg-[#1a8cd8]',
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      name: 'Facebook',
      icon: FiFacebook,
      color: 'bg-[#4267B2] hover:bg-[#365899]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    },
    {
      name: 'LinkedIn',
      icon: FiLinkedin,
      color: 'bg-[#0077B5] hover:bg-[#006097]',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedText}`,
    },
    {
      name: 'WhatsApp',
      icon: FiMessageCircle,
      color: 'bg-[#25D366] hover:bg-[#1da851]',
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: 'Email',
      icon: FiMail,
      color: 'bg-gray-600 hover:bg-gray-700',
      url: `mailto:?subject=Check out this charity&body=${encodedText}%0A%0A${encodedUrl}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = (link) => {
    window.open(link.url, '_blank', 'width=600,height=400');
  };

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
        >
          <FiShare2 className="text-gray-600 dark:text-gray-300" />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border dark:border-slate-700 z-50 py-2 animate-slide-up">
              {shareLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    handleShare(link);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left"
                >
                  <link.icon className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{link.name}</span>
                </button>
              ))}
              <hr className="my-2 dark:border-slate-700" />
              <button
                onClick={() => {
                  handleCopyLink();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left"
              >
                {copied ? (
                  <FiCheck className="text-green-500" />
                ) : (
                  <FiCopy className="text-gray-500 dark:text-gray-400" />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <FiShare2 />
        Share Your Impact
      </h3>

      {donation && (
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 mb-4">
          <p className="text-sm text-primary-800 dark:text-primary-300">
            "{shareText}"
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        {shareLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => handleShare(link)}
            className={`${link.color} text-white p-3 rounded-full transition-all hover:scale-110 hover:shadow-lg`}
            title={`Share on ${link.name}`}
          >
            <link.icon size={20} />
          </button>
        ))}
      </div>

      {/* Copy Link */}
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          readOnly
          className="input-field flex-1 text-sm"
        />
        <button
          onClick={handleCopyLink}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            copied 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
          }`}
        >
          {copied ? <FiCheck /> : <FiCopy />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

// Share button for after successful donation
export const DonationShareCard = ({ donation, charity, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-slide-up">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 success-checkmark">
            <FiCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank You! 🎉</h2>
          <p className="text-green-100">
            Your donation of ₹{donation?.amount?.toLocaleString()} makes a real difference!
          </p>
        </div>

        {/* Share Section */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
            Inspire others by sharing your generosity
          </p>
          <SocialShare donation={donation} charity={charity} />
        </div>

        {/* Close */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="btn-outline w-full"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialShare;
