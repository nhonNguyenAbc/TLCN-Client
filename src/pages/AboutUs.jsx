import React from "react";
import { BriefcaseIcon, EyeIcon, UsersIcon, BuildingStorefrontIcon } from '@heroicons/react/24/solid'; // Import icon phù hợp

const About3 = () => {
  return (
    <div className="2xl:container 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4">
      <p className="font-normal text-sm leading-3 text-indigo-700 hover:text-indigo-800 cursor-pointer pb-2">
        Giới Thiệu
      </p>
      <div className="flex lg:flex-row flex-col lg:gap-8 sm:gap-10 gap-12">
        <div className="w-full lg:w-6/12">
          <h2 className="w-full font-bold lg:text-4xl text-3xl lg:leading-10 leading-9">
            Chào mừng đến với TableHive H&N – Giải pháp Đặt Bàn Nhà Hàng Nhanh Chóng và Đơn Giản!
          </h2>
          <p className="font-normal text-base leading-6 text-gray-600 mt-6">
            Tại TableHive H&N, chúng tôi hiểu rằng việc tìm kiếm và đặt bàn tại các nhà hàng yêu thích có thể mất nhiều thời gian và không dễ dàng. Chính vì vậy, chúng tôi đã phát triển một nền tảng trực tuyến dễ sử dụng, giúp bạn tiết kiệm thời gian và mang đến trải nghiệm ẩm thực thú vị.
          </p>
          <p className="font-normal text-base leading-6 text-gray-600 mt-4">
            Với hệ thống đặt bàn thông minh, chúng tôi cung cấp cho bạn khả năng tìm kiếm và đặt chỗ tại các nhà hàng yêu thích trong một vài thao tác đơn giản. Hãy để TableHive H&N làm cầu nối giữa bạn và những trải nghiệm ẩm thực tuyệt vời, giúp bạn có thêm thời gian để tận hưởng những khoảnh khắc đáng nhớ bên gia đình và bạn bè.
          </p>
        </div>
        <div className="w-full lg:w-6/12">
          <img
            className="lg:block hidden w-full"
            src="/img/10.jpg"
            alt="people discussing on board"
          />
          <img
            className="lg:hidden sm:block hidden w-full"
            src="https://i.ibb.co/16fPqrg/Rectangle-122-2.png"
            alt="people discussing on board"
          />
          <img
            className="sm:hidden block w-full"
            src="https://i.ibb.co/Jxhpxh6/Rectangle-122.png"
            alt="people discussing on board"
          />
        </div>
      </div>

      <div className="mt-16">
      <div className="flex items-center space-x-2">
        <BriefcaseIcon className="h-6 w-6 text-blue-500" /> {/* Thêm icon */}
        <h3 className="text-3xl font-semibold text-gray-800">Sứ Mệnh Của Chúng Tôi</h3>
      </div>
        
        <p className="text-base text-gray-600 mt-4">
          Chúng tôi cam kết mang đến cho khách hàng những dịch vụ tốt nhất, giúp việc đặt bàn trở nên dễ dàng và tiện lợi hơn bao giờ hết. TableHive H&N không chỉ là một công cụ đặt bàn, mà còn là một người bạn đồng hành trong hành trình khám phá các món ăn tuyệt vời từ những nhà hàng hàng đầu.
        </p>
      </div>

      <div className="mt-16">
      <div className="flex items-center space-x-2">
        <EyeIcon className="h-6 w-6 text-blue-500" /> {/* Thêm icon */}
        <h3 className="text-3xl font-semibold text-gray-800">Tầm Nhìn Của TableHive H&N</h3>
      </div>
        <p className="text-base text-gray-600 mt-4">
          Trở thành nền tảng đặt bàn hàng đầu tại Việt Nam, mang đến sự tiện lợi và trải nghiệm ẩm thực tuyệt vời cho mọi khách hàng. Chúng tôi luôn nỗ lực phát triển không ngừng để đáp ứng nhu cầu ngày càng cao của khách hàng, với mục tiêu xây dựng một cộng đồng yêu thích ẩm thực và trải nghiệm các dịch vụ nhà hàng chất lượng.
        </p>
      </div>

      <div className="mt-16">
      <div className="flex items-center space-x-2">
        <BuildingStorefrontIcon  className="h-6 w-6 text-blue-500" /> {/* Thêm icon */}
        <h3 className="text-3xl font-semibold text-gray-800">Giá Trị Cốt Lõi</h3>
      </div>
        <ul className="list-disc pl-5 mt-4">
          <li className="text-base text-gray-600">Chất lượng dịch vụ: Chúng tôi luôn đảm bảo chất lượng dịch vụ là ưu tiên hàng đầu, từ việc đặt bàn cho đến trải nghiệm của bạn tại nhà hàng.</li>
          <li className="text-base text-gray-600">Tính minh bạch: Chúng tôi cung cấp thông tin rõ ràng về các nhà hàng, giúp bạn dễ dàng đưa ra quyết định chính xác.</li>
          <li className="text-base text-gray-600">Khách hàng là trung tâm: Mọi quyết định và cải tiến của chúng tôi đều hướng đến việc mang lại sự hài lòng tuyệt đối cho khách hàng.</li>
          <li className="text-base text-gray-600">Sự sáng tạo: Chúng tôi luôn sáng tạo trong việc phát triển các tính năng mới để mang lại trải nghiệm tốt hơn cho người dùng.</li>
        </ul>
      </div>

      <div className="mt-16">
      <div className="flex items-center space-x-2">
        <UsersIcon  className="h-6 w-6 text-blue-500" /> {/* Thêm icon */}
        <h3 className="text-3xl font-semibold text-gray-800">Đội Ngũ Của Chúng Tôi</h3>
      </div>
        <p className="text-base text-gray-600 mt-4">
          Đội ngũ của TableHive H&N gồm những chuyên gia trong các lĩnh vực công nghệ, dịch vụ khách hàng và quản lý nhà hàng. Mỗi thành viên trong đội ngũ đều mang đến những giá trị độc đáo và tinh thần làm việc không ngừng nghỉ để mang đến cho khách hàng những dịch vụ tốt nhất. Chúng tôi luôn cố gắng tạo ra một môi trường làm việc thân thiện và sáng tạo, nơi mà mọi ý tưởng đều được chào đón và thực hiện.
        </p>
      </div>
      
    </div>
  );
};

export default About3;
