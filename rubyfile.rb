desc "Checks the version numbers of each of the build tools."
lane :check_tools do
  ANDROID_SDK = '23.0.1'
  CHECK_ANDROID_SDK = "$ANDROID_HOME/tools/bin/sdkmanager --list | grep 'build-tools;#{ANDROID_SDK}' | tail -1 | awk '{print $3}'"
  [
    ['Android SDK',    ANDROID_SDK, CHECK_ANDROID_SDK],
    ['Xcode',         '8.2.1',      'xcodebuild -version | head -1 | sed "s/Xcode //"'],
    ['Node.JS',       '8.4.0',      'node --version'],
    ['NPM',           '5.3.0',      'npm --version'],
    ['Yarn',          '0.27.5',     'yarn --version'],
    ['Cocoapods',     '1.3.1',      'pod --version'],
    ['Code Push',     '2.0.2',      'code-push --version'],
    ['Mobile Center', '0.11.0',     'mobile-center -v | awk "{print $3}"'],
  ].each do |tool, version, binary|
    # grab the version
    found = sh(binary).strip.gsub(/^v/, '').split('.').map { |v| v.to_i } rescue UI.user_error!("#{tool} not found, LOL.")

    # compare expected vs actual
    expected = version.split('.').map { |v| v.to_i }
    is_valid = found[0] > expected[0] ||
      found[0] == expected[0] && found[1] > expected[1] ||
      found[0] == expected[0] && found[1] == expected[1] && found[2] >= expected[2]

    # die horribly if we don't match
    unless is_valid
      message = "#{tool} >= #{version} required but found #{found.join('.')}."
      UI.user_error! message
    end
  end
end
