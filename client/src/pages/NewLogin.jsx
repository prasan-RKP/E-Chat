<button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`submit-btn w-full py-3 rounded-md font-medium transition text-white transform hover:scale-105 hover:shadow-lg ${
                isLoading
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
              style={{
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }
              }}
              onMouseDown={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'scale(0.95)';
                }
              }}
              onMouseUp={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'scale(1.05)';
                }
              }}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Log In"
              )}
            </button>