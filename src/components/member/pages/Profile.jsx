const Profile = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 py-10 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-md p-10">
        {/* 내 프로필 */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">내 프로필</h2>
            <button className="text-sm border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-50 transition">
              설정
            </button>
          </div>

          <hr className="mb-6 border-gray-300" />

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-4xl">
              <span>👤</span>
            </div>
            <div>
              <p className="text-lg">
                <b>닉네임:</b> jhapoy106
              </p>
              <p className="text-gray-600">
                <b>자기소개:</b> 나만의 스킬, 깃허브 링크 등으로 소개글을 채워보세요.
              </p>
            </div>
          </div>
        </section>

        {/* 기본 정보 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">기본 정보</h2>
          </div>

          <hr className="mb-6 border-gray-300" />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-800">
                <b>이메일:</b> jhapoy106@naver.com
              </p>
              <button className="text-sm border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-50 transition">
                설정
              </button>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-gray-800">
                <b>비밀번호:</b> ****** 
              </p>
              <button className="text-sm border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-50 transition">
                설정
              </button>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-gray-800">
                <b>휴대폰 번호:</b> 휴대폰 번호를 인증해 주세요.
              </p>
              <button className="text-sm border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-50 transition">
                설정
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
