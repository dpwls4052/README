const Profile = () => {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {/* 내 프로필 */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">내 프로필</h2>
          <button className="text-sm border border-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-50">
            설정
          </button>
        </div>

        <hr className="mb-4 border-gray-300" />

        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full" />
          <div>
            <p><b>닉네임:</b> jhapoy106</p>
            <p>
              <b>프로필 주소:</b>{" "}
              <a
                href="https://inflearn.com/users/@jhapoy1068947"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                inflearn.com/users/@jhapoy1068947
              </a>
            </p>
            <p><b>자기소개:</b> 나만의 스킬, 깃허브 링크 등으로 소개글을 채워보세요.</p>
          </div>
        </div>
      </section>

      {/* 기본 정보 */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">기본 정보</h2>
        </div>

        <hr className="mb-4 border-gray-300" />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p><b>이메일:</b> jhapoy106@naver.com</p>
            <button className="text-sm border border-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-50">
              설정
            </button>
          </div>

          <div className="flex justify-between items-center">
            <p><b>비밀번호:</b> ******</p>
            <button className="text-sm border border-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-50">
              설정
            </button>
          </div>

          <div className="flex justify-between items-center">
            <p><b>휴대폰 번호:</b> 휴대폰 번호를 인증해 주세요.</p>
            <button className="text-sm border border-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-50">
              설정
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
