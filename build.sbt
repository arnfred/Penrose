import com.typesafe.startscript.StartScriptPlugin

seq(SbtStartScript.startScriptForClassesSettings: _*)

name := "Penrose"

version := "1.0"

scalaVersion := "2.10.0"

scalaSource in Compile <<= baseDirectory(_ / "src")

scalacOptions ++= Seq("-unchecked", "-Ywarn-dead-code", "-deprecation")

libraryDependencies  ++= Seq(
            // other dependencies here
            // pick and choose:
			"net.databinder" %% "unfiltered-netty-server" % "0.6.7",
			"com.dongxiguo" %% "fastring" % "0.2.1",
			"net.databinder" %% "unfiltered-filter" % "0.6.7"
)

resolvers ++= Seq(
            // other resolvers here
            // if you want to use snapshot builds (currently 0.2-SNAPSHOT), use this.
			"akr4 release" at "http://akr4.github.com/mvn-repo/releases",
			"Typesafe Repository" at "http://repo.typesafe.com/typesafe/releases/",
			"Typesafe Snapshots" at "http://repo.typesafe.com/typesafe/snapshots/",
			"Sonatype OSS Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots"
)

// The main class
mainClass in (Compile, run) := Some("penrose.Main")
