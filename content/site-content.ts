export type Section = { id: string; title: string; body: string[]; bullets?: string[] }
export type PageContent = { title: string; description: string; kicker: string; sections: Section[] }

export const pages: Record<string, PageContent> = {
  'huong-dan': {
    title: 'Cách lấy và sử dụng mã 2FA an toàn',
    description: 'Hướng dẫn nhập khóa Base32, đọc mã TOTP, lưu trên trình duyệt và xử lý khi mất thiết bị.',
    kicker: 'Hướng dẫn thực hành',
    sections: [
      { id: 'chuan-bi', title: '1. Chuẩn bị khóa thiết lập', body: ['Khi bật xác thực hai bước, dịch vụ thường hiển thị mã QR và một chuỗi ký tự gọi là secret key. Hãy lưu recovery code trước khi đóng màn hình thiết lập.', 'MFA Tool nhận khóa Base32, định dạng “email | key” và URI otpauth. Email chỉ là nhãn để bạn phân biệt nhiều tài khoản.'] },
      { id: 'tao-ma', title: '2. Tạo mã TOTP', body: ['Mở Công cụ, dán khóa vào ô nhập rồi chọn thêm mã. Mã sáu chữ số đổi sau mỗi chu kỳ, thường là 30 giây. Sao chép mã hiện tại và nhập ngay vào dịch vụ cần xác minh.', 'Nếu mã bị từ chối, kiểm tra thời gian trên thiết bị đang được đặt tự động. Sai lệch đồng hồ là nguyên nhân phổ biến.'] },
      { id: 'luu-khoa', title: '3. Quyết định có lưu khóa', body: ['Khi bật “Lưu key trên trình duyệt”, dữ liệu được ghi vào localStorage của trình duyệt này. Tính năng tiện lợi nhưng bất kỳ ai mở được hồ sơ trình duyệt đều có thể lấy khóa.', 'Chỉ bật trên thiết bị cá nhân có khóa màn hình. Với máy dùng chung, hãy tắt lưu và xóa khóa sau khi sử dụng.'] },
      { id: 'du-phong', title: '4. Chuẩn bị đường khôi phục', body: ['Giữ recovery code ngoại tuyến, thêm phương thức xác minh dự phòng nếu dịch vụ hỗ trợ, và kiểm tra định kỳ rằng bạn vẫn truy cập được chúng. Không lưu recovery code cạnh mật khẩu chính.'] },
    ],
  },
  '2fa-la-gi': {
    title: '2FA, TOTP, HOTP và Base32 là gì?',
    description: 'Hiểu cơ chế xác thực hai yếu tố và cách ứng dụng tạo mã dùng một lần.',
    kicker: 'Kiến thức nền',
    sections: [
      { id: 'hai-yeu-to', title: '2FA bổ sung một lớp xác minh', body: ['Mật khẩu là yếu tố “thứ bạn biết”. 2FA yêu cầu thêm “thứ bạn có” như điện thoại, khóa bảo mật hoặc ứng dụng tạo mã. Kẻ tấn công có mật khẩu vẫn cần vượt qua lớp thứ hai.'] },
      { id: 'totp', title: 'TOTP dựa trên thời gian', body: ['TOTP kết hợp secret key với mốc thời gian để tạo mã ngắn. Máy chủ và ứng dụng không cần trao đổi mỗi lần; chúng tạo cùng kết quả nếu cùng khóa và đồng hồ đủ chính xác.', 'Secret key quan trọng hơn mã sáu số vì ai giữ khóa có thể tạo mọi mã trong tương lai.'] },
      { id: 'hotp', title: 'HOTP dựa trên bộ đếm', body: ['HOTP dùng một bộ đếm tăng sau mỗi mã thay vì thời gian. Hai phía phải giữ bộ đếm đồng bộ. TOTP phổ biến hơn trong ứng dụng xác thực hiện nay.'] },
      { id: 'base32', title: 'Base32 là cách biểu diễn khóa', body: ['Base32 dùng chữ A–Z và số 2–7 để biểu diễn dữ liệu nhị phân dễ sao chép. Nó không mã hóa hay bảo vệ secret; nhìn thấy chuỗi Base32 vẫn đồng nghĩa có thể sở hữu khóa.'] },
    ],
  },
  'bao-mat-tai-khoan': {
    title: 'Bảo vệ tài khoản theo nhiều lớp',
    description: 'Checklist thực tế về mật khẩu, 2FA, phishing, phiên đăng nhập và khôi phục.',
    kicker: 'An toàn tài khoản',
    sections: [
      { id: 'mat-khau', title: 'Dùng mật khẩu riêng cho từng dịch vụ', body: ['Trình quản lý mật khẩu giúp tạo chuỗi dài, ngẫu nhiên và không lặp lại. Khi một dịch vụ rò rỉ, mật khẩu riêng ngăn kẻ xấu dùng lại trên email hoặc ngân hàng.'] },
      { id: 'phuong-thuc', title: 'Ưu tiên phương thức chống phishing', body: ['Khóa bảo mật FIDO2 hoặc passkey có khả năng ràng buộc với đúng tên miền. TOTP tốt hơn chỉ dùng mật khẩu nhưng mã vẫn có thể bị lừa nhập vào trang giả.'] },
      { id: 'phishing', title: 'Kiểm tra ngữ cảnh trước khi xác minh', body: ['Không đọc mã cho người tự xưng là hỗ trợ viên. Kiểm tra tên miền, nguồn yêu cầu và hoạt động đăng nhập. Một mã bạn không chủ động yêu cầu là tín hiệu cần đổi mật khẩu và thu hồi phiên.'] },
      { id: 'kiem-tra', title: 'Rà soát phiên và đường khôi phục', body: ['Đăng xuất thiết bị lạ, cập nhật email/số điện thoại khôi phục và giữ recovery code ở nơi riêng biệt. Bảo vệ email chính nghiêm ngặt vì nó thường mở khóa mọi tài khoản khác.'] },
    ],
  },
  faq: {
    title: 'Câu hỏi thường gặp về MFA Tool',
    description: 'Giải đáp về lưu khóa, độ an toàn, mã sai, mất thiết bị và quyền riêng tư.',
    kicker: 'FAQ',
    sections: [
      { id: 'luu-server', title: 'MFA Tool có gửi secret lên máy chủ không?', body: ['Phần tạo mã TOTP chạy trong trình duyệt. Secret được xử lý trên thiết bị và chỉ được lưu vào localStorage khi bạn bật tùy chọn lưu khóa. Các tab tra cứu IP/tên miền dùng API riêng nhưng không cần secret TOTP.'] },
      { id: 'localstorage', title: 'Lưu trong trình duyệt có an toàn tuyệt đối không?', body: ['Không. localStorage không phải két bí mật. Người có quyền truy cập thiết bị, extension độc hại hoặc mã chạy cùng website có thể đọc dữ liệu. Chỉ dùng trên thiết bị cá nhân được bảo vệ.'] },
      { id: 'ma-sai', title: 'Vì sao mã đúng định dạng nhưng bị từ chối?', body: ['Hãy bật đồng bộ thời gian tự động, chắc chắn đang dùng đúng tài khoản và đợi chu kỳ mới nếu mã sắp hết hạn. Nếu vẫn lỗi, thiết lập lại 2FA từ chính dịch vụ.'] },
      { id: 'mat-may', title: 'Mất thiết bị thì làm gì?', body: ['Dùng recovery code hoặc phương thức dự phòng để đăng nhập, sau đó thu hồi secret cũ và thiết lập 2FA lại. Nếu không có phương án dự phòng, liên hệ kênh khôi phục chính thức của dịch vụ.'] },
      { id: 'authenticator', title: 'Có nên thay ứng dụng authenticator bằng website này?', body: ['Không nên xem đây là thay thế hoàn toàn cho authenticator chuyên dụng. Công cụ phù hợp cho tình huống cần tạo mã nhanh; ứng dụng chuyên dụng có thể cung cấp bảo vệ khóa, sinh trắc học và backup mã hóa tốt hơn.'] },
    ],
  },
  'gioi-thieu': {
    title: 'Về MFA Tool',
    description: 'Mục tiêu, nguyên tắc riêng tư và phạm vi của dự án MFA Tool.',
    kicker: 'Giới thiệu',
    sections: [
      { id: 'muc-tieu', title: 'Công cụ nhỏ, giải thích rõ', body: ['MFA Tool cung cấp tiện ích tạo mã TOTP và tài liệu bảo mật tiếng Việt dễ áp dụng. Mục tiêu là giúp người dùng hiểu dữ liệu nào đang được xử lý, không chỉ đưa ra một nút bấm.'] },
      { id: 'nguyen-tac', title: 'Secret TOTP ở lại trên thiết bị', body: ['Logic tạo mã chạy phía trình duyệt. Tùy chọn lưu khóa dùng localStorage và luôn đi kèm cảnh báo phù hợp. Chúng tôi không yêu cầu tài khoản để dùng công cụ.'] },
      { id: 'gioi-han', title: 'Phạm vi và giới hạn', body: ['MFA Tool không phải dịch vụ quản lý danh tính, không khôi phục được tài khoản và không bảo đảm chống mọi cuộc tấn công. Người dùng vẫn cần recovery code và quy trình dự phòng riêng.'] },
    ],
  },
  'lien-he': {
    title: 'Liên hệ',
    description: 'Kênh liên hệ chính thức để báo lỗi hoặc góp ý cho MFA Tool.',
    kicker: 'Liên hệ',
    sections: [
      { id: 'telegram', title: 'Telegram', body: ['Liên hệ @kiratech1011 trên Telegram để báo lỗi, góp ý nội dung hoặc đề xuất tính năng. Không gửi secret TOTP, recovery code, mật khẩu hay dữ liệu tài khoản qua tin nhắn.'] },
      { id: 'youtube', title: 'YouTube', body: ['Theo dõi kênh Kira Tech TK Premium tại youtube.com/@KiraTechTKpremium để xem nội dung và hướng dẫn mới.'] },
      { id: 'email', title: 'Email', body: ['Gửi phản hồi chi tiết tới kira10111907@gmail.com. Hãy che mọi secret, mã 2FA, recovery code và thông tin định danh trước khi đính kèm ảnh.'] },
      { id: 'bao-loi', title: 'Thông tin hữu ích khi báo lỗi', body: ['Mô tả thiết bị, trình duyệt, đường dẫn gặp lỗi và các bước tái hiện. Có thể gửi ảnh chụp đã che toàn bộ secret, mã 2FA, IP cá nhân và thông tin định danh.'] },
    ],
  },
  'chinh-sach-bao-mat': {
    title: 'Chính sách bảo mật',
    description: 'Cách MFA Tool xử lý khóa TOTP, localStorage, tra cứu IP, analytics và quảng cáo.',
    kicker: 'Cập nhật 31/07/2026',
    sections: [
      { id: 'totp', title: 'Dữ liệu TOTP', body: ['Việc tạo mã diễn ra trong trình duyệt. Khi bạn bật lưu khóa, secret và nhãn tài khoản được ghi vào localStorage trên thiết bị. Tắt tùy chọn hoặc xóa dữ liệu website để loại bỏ chúng.'] },
      { id: 'ip', title: 'Tra cứu IP và tên miền', body: ['Khi dùng tab tra cứu, địa chỉ IP hoặc tên miền bạn nhập được gửi tới API của website và nhà cung cấp dữ liệu IP2Location/IP2WHOIS để trả kết quả. Không nhập secret TOTP vào các ô này.'] },
      { id: 'analytics', title: 'Đo lường và quảng cáo', body: ['Website có thể dùng Vercel Analytics để đo lượt xem và hiệu năng. Quảng cáo có thể được bổ sung sau khi có phê duyệt; nếu công nghệ quảng cáo yêu cầu consent theo khu vực, lựa chọn sẽ được hiển thị trước khi kích hoạt.'] },
      { id: 'quyen', title: 'Lựa chọn của bạn', body: ['Bạn có thể chặn lưu trữ qua cài đặt trình duyệt, tắt lưu key và xóa site data. Liên hệ Telegram @kiratech1011 nếu có câu hỏi về chính sách.'] },
    ],
  },
  'dieu-khoan-su-dung': {
    title: 'Điều khoản sử dụng',
    description: 'Điều kiện và giới hạn trách nhiệm khi sử dụng MFA Tool.',
    kicker: 'Cập nhật 31/07/2026',
    sections: [
      { id: 'chap-nhan', title: 'Chấp nhận và sử dụng hợp pháp', body: ['Bằng việc sử dụng website, bạn đồng ý chỉ dùng công cụ cho tài khoản, IP và tên miền mà mình có quyền truy cập hoặc kiểm tra hợp pháp.'] },
      { id: 'khong-bao-dam', title: 'Không bảo đảm tuyệt đối', body: ['Dịch vụ được cung cấp theo hiện trạng. Kết quả tra cứu có thể thiếu hoặc chậm; mã TOTP phụ thuộc secret và thời gian chính xác. Hãy duy trì authenticator và recovery code đáng tin cậy.'] },
      { id: 'trach-nhiem', title: 'Trách nhiệm của người dùng', body: ['Bạn chịu trách nhiệm bảo vệ secret, thiết bị và dữ liệu đã lưu trong trình duyệt. Không chia sẻ mã dùng một lần hoặc recovery code cho bất kỳ ai.'] },
      { id: 'thay-doi', title: 'Thay đổi dịch vụ', body: ['Tính năng và điều khoản có thể thay đổi để cải thiện an toàn hoặc tuân thủ pháp luật. Ngày cập nhật được ghi ở đầu trang.'] },
    ],
  },
  cookie: {
    title: 'Cookie và lưu trữ cục bộ',
    description: 'Giải thích localStorage, analytics và lựa chọn kiểm soát dữ liệu trên MFA Tool.',
    kicker: 'Minh bạch dữ liệu',
    sections: [
      { id: 'local', title: 'localStorage phục vụ tính năng', body: ['Website dùng localStorage để nhớ giao diện và, khi bạn chủ động bật, lưu danh sách secret TOTP. Dữ liệu này tồn tại trong trình duyệt cho đến khi bạn xóa hoặc tắt lưu.'] },
      { id: 'cookie', title: 'Cookie và công nghệ tương tự', body: ['Analytics hoặc quảng cáo trong tương lai có thể dùng cookie hay định danh tương tự để đo lường. Các công nghệ không thiết yếu cần consent sẽ không được bật trước lựa chọn của bạn khi pháp luật áp dụng yêu cầu đó.'] },
      { id: 'kiem-soat', title: 'Cách kiểm soát', body: ['Dùng cài đặt quyền riêng tư của trình duyệt để xem, chặn hoặc xóa cookie và site data. Lưu ý xóa dữ liệu website cũng xóa các key bạn đã chọn lưu.'] },
    ],
  },
}

export const blogPosts: Record<string, PageContent & { date: string }> = {
  'nhan-biet-phishing': { date: '2026-07-31', kicker: 'Phishing', title: 'Nhận biết trang đăng nhập giả trước khi nhập mã 2FA', description: 'Các dấu hiệu thực tế giúp tránh trao mật khẩu và mã TOTP cho kẻ tấn công.', sections: [
    { id: 'tai-sao', title: '2FA vẫn có thể bị phishing', body: ['Trang giả có thể chuyển tiếp mật khẩu và mã TOTP tới dịch vụ thật trong thời gian thực. Vì vậy mã dùng một lần không thay thế việc kiểm tra đúng tên miền.'] },
    { id: 'dau-hieu', title: 'Dấu hiệu cần dừng lại', body: ['Yêu cầu gấp, đường dẫn lạ, tên miền gần giống và thông báo “tài khoản sắp khóa” là các mẫu thường gặp. Hãy tự mở ứng dụng hoặc gõ địa chỉ chính thức thay vì dùng link trong tin nhắn.'] },
    { id: 'xu-ly', title: 'Nếu đã nhập thông tin', body: ['Đổi mật khẩu từ thiết bị tin cậy, thu hồi mọi phiên đăng nhập, tạo lại secret 2FA và kiểm tra quy tắc chuyển tiếp email. Báo cáo URL giả cho dịch vụ bị mạo danh.'] },
  ] },
  'recovery-code': { date: '2026-07-25', kicker: 'Khôi phục', title: 'Recovery code: chiếc chìa khóa dự phòng dễ bị quên', description: 'Cách lưu, kiểm tra và sử dụng recovery code mà không tạo thêm điểm yếu.', sections: [
    { id: 'vai-tro', title: 'Recovery code dùng khi nào?', body: ['Đây là mã dự phòng để vượt qua bước 2FA khi mất điện thoại hoặc khóa bảo mật. Mỗi mã thường chỉ dùng một lần và có quyền truy cập tương đương yếu tố thứ hai.'] },
    { id: 'luu', title: 'Lưu tách khỏi mật khẩu', body: ['Có thể in và cất nơi an toàn hoặc lưu trong kho mã hóa. Không đặt ảnh recovery code trong thư viện ảnh đồng bộ công khai hay gửi qua chat.'] },
    { id: 'kiem-tra', title: 'Kiểm tra định kỳ', body: ['Đảm bảo bạn biết nơi lấy code và tài khoản vẫn nhận phương thức khôi phục. Sau khi dùng hoặc nghi rò rỉ, tạo bộ code mới để vô hiệu hóa bộ cũ.'] },
  ] },
  'backup-2fa': { date: '2026-07-18', kicker: 'Dự phòng', title: 'Backup 2FA mà không nhân bản rủi ro', description: 'Thiết kế đường dự phòng cho 2FA trên nhiều thiết bị một cách có kiểm soát.', sections: [
    { id: 'mo-hinh', title: 'Chọn mô hình dự phòng', body: ['Bạn có thể có khóa bảo mật thứ hai, authenticator backup mã hóa hoặc recovery code ngoại tuyến. Mỗi lựa chọn cân bằng giữa tiện lợi và bề mặt tấn công.'] },
    { id: 'ma-hoa', title: 'Chỉ đồng bộ khi được mã hóa phù hợp', body: ['Nếu dùng cloud backup, kiểm tra dữ liệu có mã hóa đầu cuối và tài khoản cloud có 2FA mạnh. Một bản sao không được bảo vệ có thể vô hiệu hóa lợi ích của 2FA.'] },
    { id: 'thu-nghiem', title: 'Thử quy trình trước sự cố', body: ['Không cần đăng xuất tài khoản chính; hãy xác minh rằng thiết bị dự phòng tạo đúng mã và recovery code đang ở nơi có thể truy cập trong tình huống khẩn cấp.'] },
  ] },
  'thoi-quen-bao-mat': { date: '2026-07-10', kicker: 'Thói quen', title: 'Bốn thói quen bảo mật có tác dụng hơn cảnh giác nhất thời', description: 'Một routine ngắn để giảm rủi ro chiếm tài khoản lâu dài.', sections: [
    { id: 'hang-tuan', title: 'Biến an toàn thành hệ thống', body: ['Dùng password manager, cập nhật tự động, 2FA và khóa màn hình giúp bạn không phải ra quyết định an toàn lặp lại mỗi ngày.'] },
    { id: 'canh-bao', title: 'Đọc cảnh báo đăng nhập', body: ['Cảnh báo thiết bị mới hoặc reset 2FA phải được xử lý ngay. Nếu không phải bạn, đổi mật khẩu và thu hồi phiên trước khi trả lời email hoặc tin nhắn.'] },
    { id: 'quy', title: 'Rà soát mỗi quý', body: ['Xóa ứng dụng kết nối không dùng, kiểm tra phương thức khôi phục, cập nhật recovery code và loại bỏ tài khoản cũ chứa dữ liệu nhạy cảm.'] },
  ] },
}
